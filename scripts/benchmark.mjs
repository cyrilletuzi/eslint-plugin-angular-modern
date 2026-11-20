// Compares the linting speed of 2 builds of the plugin on realistic and valid Angular code,
// which is the case that must not be impacted negatively.
// Usage: node scripts/benchmark.mjs <before dist directory> <after dist directory>
// Prints a Markdown summary, and exits with an error only if the "after" build is clearly slower.

import * as parser from "@typescript-eslint/parser";
import { Linter } from "eslint";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const [beforePath, afterPath] = process.argv.slice(2);

if (!beforePath || !afterPath) {
  console.error("Usage: node scripts/benchmark.mjs <before dist directory> <after dist directory>");
  process.exit(2);
}

/* Builds are CommonJS and their paths are only known at runtime: `module.exports` is the default export */
const { default: before } = await import(pathToFileURL(resolve(beforePath, "index.js")).href);
const { default: after } = await import(pathToFileURL(resolve(afterPath, "index.js")).href);

/* Above this slowdown of the rules, the check fails (shared CI runners are noisy, so it must not fail on noise) */
const maxSlowdown = 0.25;
/* Minimum for consistent results (less makes the results biased or too noisy) */
const warmupRounds = 3;
const rounds = 12;

/* Realistic and valid modern Angular code: components, services, routes, guards, interceptors, tests */
const files = [];
for (let i = 0; i < 40; i++) {
  files.push(`import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { form, FormField } from '@angular/forms/signals';
import { ProductApi${i} } from './product-api';

@Component({
  selector: 'app-product-${i}',
  imports: [RouterLink, FormField],
  host: { '[class.active]': 'active()', '(click)': 'select()' },
  template: \`<a routerLink="/products/{{ id() }}">{{ title() }}</a><input [formField]="searchForm.query" />\`,
})
export class ProductCard${i} {
  readonly #api = inject(ProductApi${i});
  readonly id = input.required<number>();
  readonly selected = output<number>();
  protected readonly active = signal(false);
  protected readonly product = toSignal(this.#api.get(${i}), { initialValue: undefined });
  protected readonly title = computed(() => this.product()?.name.toUpperCase() ?? '');
  readonly #search = signal({ query: '' });
  protected readonly searchForm = form(this.#search);

  constructor() {
    effect(() => {
      console.log(this.id(), this.active());
    });
  }

  protected select(): void {
    this.active.update((value) => !value);
    this.selected.emit(this.id());
  }
}
`);
  files.push(`import { Service, inject, resource, signal } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { map, type Observable } from 'rxjs';

export interface Product { id: number; name: string; price: number }

@Service()
export class ProductApi${i} {
  readonly #http = inject(HttpClient);
  readonly #page = signal(1);
  readonly products = httpResource<Product[]>(() => \`/api/products?page=\${this.#page()}\`);
  readonly stock = resource({ params: () => this.#page(), loader: ({ params }) => fetch(\`/api/stock/\${params}\`).then((r) => r.json()) });

  get(id: number): Observable<Product> {
    return this.#http.get<Product>(\`/api/products/\${id}\`).pipe(map((product) => ({ ...product, price: product.price * 1.2 })));
  }

  nextPage(): void {
    this.#page.update((page) => page + 1);
  }
}
`);
  files.push(`import { inject } from '@angular/core';
import { type CanActivateFn, type HttpInterceptorFn, Router, type Routes } from '@angular/router';
import { AuthStore${i} } from './auth-store';

export const authGuard${i}: CanActivateFn = () => inject(AuthStore${i}).isLoggedIn() || inject(Router).parseUrl('/login');

export const authInterceptor${i}: HttpInterceptorFn = (request, next) => {
  const authStore = inject(AuthStore${i});
  const token = authStore.token();
  return next(token ? request.clone({ setHeaders: { Authorization: \`Bearer \${token}\` } }) : request);
};

export const routes${i}: Routes = [
  { path: '', loadComponent: () => import('./home').then((m) => m.Home) },
  { path: 'products/:id', canActivate: [authGuard${i}], loadComponent: () => import('./product').then((m) => m.ProductPage) },
];
`);
  files.push(`import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductCard${i} } from './product-card';

describe('ProductCard${i}', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('should toggle when clicked', async () => {
    const fixture = TestBed.createComponent(ProductCard${i});
    fixture.componentRef.setInput('id', ${i});
    await fixture.whenStable();
    fixture.nativeElement.click();
    await fixture.whenStable();
    expect(fixture.nativeElement.classList).toContain('active');
  });
});
`);
}

function config(plugin) {
  const rules = {};
  for (const name of Object.keys(plugin.rules)) {
    rules[`plugin/${name}`] = name === "custom-function-in-injection-context" ?
      ["error", { functions: [{ name: "myCustomFunction" }] }] :
      "error";
  }
  return [{ languageOptions: { parser }, plugins: { plugin }, rules }];
}

const configs = {
  baseline: [{ languageOptions: { parser } }],
  before: config(before),
  after: config(after),
};

const linter = new Linter({ configType: "flat" });

/* The corpus must be valid code, otherwise the benchmark does not measure the right case */
for (const name of ["before", "after"]) {
  const messages = files.flatMap((code) => linter.verify(code, configs[name]));
  if (messages.length > 0) {
    console.error(`The benchmark code is not valid with the "${name}" build:\n${messages.slice(0, 5).map((m) => `- ${m.ruleId ?? "parsing"}: ${m.message}`).join("\n")}`);
    process.exit(2);
  }
}

const times = { baseline: [], before: [], after: [] };
for (let round = 0; round < warmupRounds + rounds; round++) {
  /* Alternate the order, otherwise the last build of each round is favored (warmer JIT and caches) */
  const order = round % 2 === 0 ? ["baseline", "before", "after"] : ["baseline", "after", "before"];
  for (const name of order) {
    const start = performance.now();
    for (const code of files) {
      linter.verify(code, configs[name]);
    }
    if (round >= warmupRounds) {
      times[name].push(performance.now() - start);
    }
  }
}

const median = (values) => [...values].sort((a, b) => a - b)[values.length >> 1];
const parsing = median(times.baseline);
const beforeRules = median(times.before) - parsing;
const afterRules = median(times.after) - parsing;
/* Paired comparison: each round is compared with its own parsing time, to cancel the drifts of the machine */
const change = median(times.after.map((after, round) => (after - times.baseline[round]) / (times.before[round] - times.baseline[round]))) - 1;
const lines = files.reduce((total, code) => total + code.split("\n").length, 0);

console.log(`### Performance on valid Angular code

${files.length} files, ${lines} lines, all ${Object.keys(after.rules).length} rules enabled (parsing excluded).

| Before | After | Change |
| --- | --- | --- |
| ${beforeRules.toFixed(0)} ms | ${afterRules.toFixed(0)} ms | ${change > 0 ? "+" : ""}${(change * 100).toFixed(0)}% |
`);

if (change > maxSlowdown) {
  console.log(`❌ The rules are more than ${maxSlowdown * 100}% slower on valid code.`);
  process.exit(1);
}
