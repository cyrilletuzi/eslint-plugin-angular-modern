/**
 * `inject()` enables ALL special injection contexts, so this file is the exhaustive test suite
 * of the shared injection context detection logic (`src/utils/angular-injection-context.ts` and its dependencies).
 *
 * Other injection context rules only test their own specificities (explicit injector argument, enabled special contexts).
 */
import { describe } from "vitest";
import * as rule from "../../../src/rules/injection-context/inject-in-injection-context.js";
import { testRule } from "../../rule-tester.js";
import { injectionContextsCases, withImport } from "./injection-contexts.js";

/* Rules only check functions imported from Angular */
const importDeclaration = `import { inject } from "@angular/core";`;

const errors = [{ messageId: "injectInInjectionContext" }];

describe("outside of any injection context", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Other functions are ignored
      `notInject(A);`,
      `injector.inject(A);`,
      `this.inject(A);`,
    ],
    invalid: [
      { code: `inject(A);`, errors },
      { code: `const a = inject(A);`, errors },
      { code: `export const a = inject(A);`, errors },
      { code: `function f() { return inject(A); }`, errors },
      { code: `const f = () => inject(A);`, errors },
      { code: `const f = function () { return inject(A); };`, errors },
      { code: `const o = { a: inject(A) };`, errors },
      { code: `const o = { m() { return inject(A); } };`, errors },
      // One error per call
      { code: `inject(A); inject(B);`, errors: [...errors, ...errors] },
    ],
  }));
});

describe("class initialization (constructor and field initializers)", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // All Angular class decorators, called or not
      `@Component() class A { a = inject(A); }`,
      `@Component({ selector: 'app-a' }) class A { a = inject(A); }`,
      `@Directive() class A { a = inject(A); }`,
      `@Pipe({ name: 'a' }) class A { a = inject(A); }`,
      `@Injectable() class A { a = inject(A); }`,
      `@Injectable({ providedIn: 'root' }) class A { a = inject(A); }`,
      `@NgModule() class A { a = inject(A); }`,
      `@Service() class A { a = inject(A); }`,
      `@Service class A { a = inject(A); }`,
      `@Component class A { a = inject(A); }`,
      // Angular decorator among others
      `@Other() @Component() class A { a = inject(A); }`,
      // Exported classes
      `@Component() export class A { a = inject(A); }`,
      `export @Component() class A { a = inject(A); }`,
      `@Component() export default class A { a = inject(A); }`,
      // Field variants
      `@Component() class A { readonly a = inject(A); }`,
      `@Component() class A { private readonly a = inject(A); }`,
      `@Component() class A { protected a = inject(A); }`,
      `@Component() class A { #a = inject(A); }`,
      `@Component() class A { a: A = inject(A); }`,
      `@Component() class A { ['a'] = inject(A); }`,
      // Nested in an expression of the field initializer
      `@Component() class A { a = inject(A).something; }`,
      `@Component() class A { a = inject(A).something(); }`,
      `@Component() class A { a = toSignal(inject(A).data); }`,
      `@Component() class A { a = inject(A, { optional: true }) ?? 'default'; }`,
      `@Component() class A { a = { b: inject(A) }; }`,
      `@Component() class A { a = [inject(A)]; }`,
      `@Component() class A { a = cond ? inject(A) : inject(B); }`,
      `@Component() class A { a = inject(A).pipe(map((x) => x)); }`,
      // Constructor
      `@Component() class A { constructor() { inject(A); } }`,
      `@Component() class A { constructor() { const a = inject(A); } }`,
      `@Component() class A { constructor() { this.a = inject(A); } }`,
      `@Component() class A { constructor() { super(inject(A)); } }`,
      `@Component() class A { constructor(a = inject(A)) {} }`,
      `@Component() class A { constructor() { if (cond) { inject(A); } } }`,
      `@Component() class A { constructor() { try { inject(A); } catch {} } }`,
      `@Component() class A { constructor() { for (const x of xs) { inject(A); } } }`,
      `@Component() class A { constructor() { toUser(inject(A)); } }`,
      // Auto-accessor (`accessor` keyword) initializers run at construction too
      `@Component() class A { accessor a = inject(A); }`,
    ],
    invalid: [
      // Static fields are initialized when the class is defined, not in an injection context
      { code: `@Component() class A { static a = inject(A); }`, errors },
      { code: `@Component() class A { static accessor a = inject(A); }`, errors },
      // Not an Angular class
      { code: `class A { a = inject(A); }`, errors },
      { code: `class A { constructor() { inject(A); } }`, errors },
      { code: `@Other() class A { a = inject(A); }`, errors },
      { code: `@ng.Component() class A { a = inject(A); }`, errors },
      // ACCEPTED FALSE POSITIVE: a decorated class expression is not recognized as an Angular class, only class declarations are (not used in Angular code)
      { code: `const A = @Component() class { a = inject(A); };`, errors },
      // Methods other than the constructor
      { code: `@Component() class A { ngOnInit() { inject(A); } }`, errors },
      { code: `@Component() class A { method() { inject(A); } }`, errors },
      { code: `@Component() class A { get a() { return inject(A); } }`, errors },
      { code: `@Component() class A { set a(v) { inject(A); } }`, errors },
      { code: `@Component() class A { static create() { return inject(A); } }`, errors },
      { code: `@Component() class A { async method() { inject(A); } }`, errors },
      // Callbacks (function passed as a call argument)
      { code: `@Component() class A { a = obs.pipe(map(() => inject(A))); }`, errors },
      { code: `@Component() class A { a = obs.pipe(switchMap((id) => inject(A).get(id))); }`, errors },
      { code: `@Component() class A { a = computed(() => inject(A).value()); }`, errors },
      { code: `@Component() class A { a = setTimeout(function () { inject(A); }); }`, errors },
      { code: `@Component() class A { constructor() { obs.subscribe(() => { inject(A); }); } }`, errors },
      { code: `@Component() class A { constructor() { setTimeout(() => { const a = inject(A); }); } }`, errors },
      { code: `@Component() class A { constructor() { xs.forEach(function () { inject(A); }); } }`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `@Component() class A { a = () => inject(A); }`, errors },
      { code: `@Component() class A { a = () => { inject(A).navigate(['/']); }; }`, errors },
      { code: `@Component() class A { a = function () { return inject(A); }; }`, errors },
      { code: `@Component() class A { a = { m() { return inject(A); } }; }`, errors },
      { code: `@Component() class A { constructor() { const f = () => inject(A); } }`, errors },
      { code: `@Component() class A { constructor() { function f() { return inject(A); } } }`, errors },
      { code: `@Component() class A { constructor() { this.f = () => inject(A); } }`, errors },
      // KNOWN LIMITATION (FALSE POSITIVE): nested functions run synchronously
      { code: `@Component() class A { constructor() { (() => inject(A))(); } }`, errors },
      // Static blocks are run when the class is defined
      { code: `@Component() class A { static { inject(A); } }`, errors },
      // Non-Angular class nested inside an Angular class: the nearest class is the one checked
      { code: `@Component() class A { constructor() { class B { b = inject(B); } } }`, errors },
    ],
  }));
});

describe("inheritance", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Abstract base classes can only be instantiated by a child class, supposed to be an Angular class
      `abstract class Base { a = inject(A); } @Component() class Child extends Base {}`,
      `export abstract class Base { a = inject(A); }`,
      `export abstract class Base { constructor() { inject(A); } }`,
    ],
    invalid: [
      // ACCEPTED FALSE POSITIVE: a non-abstract undecorated base class is not recognized as instantiated by a decorated child class (it may be instantiated elsewhere)
      { code: `class Base { a = inject(A); } @Component() class Child extends Base {}`, errors },
      // Methods of an abstract class are not an injection context
      { code: `export abstract class Base { m() { inject(A); } }`, errors },
    ],
  }));
});

describe("function types with injection context (guards, resolvers, interceptors...)", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // All routing function types
      `const f: CanActivateFn = () => inject(A);`,
      `const f: CanActivateChildFn = () => inject(A);`,
      `const f: CanDeactivateFn<C> = () => inject(A);`,
      `const f: CanMatchFn = () => inject(A);`,
      `const f: ResolveFn<D> = () => inject(A);`,
      `const f: RunGuardsAndResolvers = () => inject(A);`,
      `const f: LoadChildren = () => inject(A);`,
      `const f: LoadChildrenCallback = () => inject(A);`,
      // HTTP
      `const f: HttpInterceptorFn = (req, next) => next(req.clone({ headers: inject(A).headers }));`,
      // Sync application initialization
      `const o: ViewTransitionsFeatureOptions = { onViewTransitionCreated: () => { inject(A); } };`,
      // Function syntaxes
      `export const f: CanActivateFn = () => inject(A);`,
      `const f: CanActivateFn = function () { return inject(A); };`,
      `const f: CanActivateFn = (route, state) => { return inject(A).check(route); };`,
      `const f: CanActivateFn = () => { const a = inject(A); return a.check(); };`,
      `const f: CanActivateFn = () => { if (cond) { return inject(A).check(); } return true; };`,
      `let f: CanActivateFn = () => inject(A);`,
      `const f: CanActivateFn = () => inject(A).check();`,
      `const f: CanActivateFn = () => [inject(A)];`,
      // Synchronous code before `await`
      `const f: CanActivateFn = async () => { const a = inject(A); await a.check(); };`,
      `const f: CanActivateFn = async () => { await something(inject(A)); };`,
      `const f: CanActivateFn = async () => { const a = await something(inject(A)); return a; };`,
      // `await` in a nested function does not pause the function
      `const f: CanActivateFn = async () => { const g = async () => { await something(); }; return inject(A); };`,
      `const f: CanActivateFn = async () => { xs.map(async (x) => await x); return inject(A); };`,
      // Nested in another expression
      `const f: CanActivateFn = () => { const user = toUser(inject(A)); return !!user; };`,
      `const f: CanActivateFn = () => { const a = inject(A).value; return a; };`,
      `const f: CanActivateFn = () => { const a = [inject(A)]; return a; };`,
      `const f: CanActivateFn = () => { const a = { b: inject(A) }; return a; };`,
      // ACCEPTED FALSE NEGATIVE: `await` after the call in a loop, which pauses before the next iterations (injecting in a loop is useless, as it always returns the same instance)
      `const f: CanActivateFn = async () => { for (const x of xs) { inject(A); await x; } };`,
    ],
    invalid: [
      // No type or other type
      { code: `const f = () => inject(A);`, errors },
      { code: `const f: Other = () => inject(A);`, errors },
      { code: `const f: Router.CanActivateFn = () => inject(A);`, errors },
      { code: `const f = (() => inject(A)) satisfies CanActivateFn;`, errors },
      { code: `const f = (() => inject(A)) as CanActivateFn;`, errors },
      { code: `function f(): ReturnType<CanActivateFn> { return inject(A); }`, errors },
      // Callbacks
      { code: `const f: CanActivateFn = () => obs.pipe(map(() => inject(A)));`, errors },
      { code: `const f: CanActivateFn = () => obs.pipe(map((x) => { return inject(A); }));`, errors },
      { code: `const f: CanActivateFn = () => { obs.subscribe(() => { inject(A); }); return true; };`, errors },
      // After `await` in the same block
      { code: `const f: CanActivateFn = async () => { await something(); return inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { await something(); const a = inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { await something(); inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { await something(); inject(A); await other(); };`, errors },
      // After any `await` before
      { code: `const f: CanActivateFn = async () => { const x = await something(); return inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { await something(); if (cond) { return inject(A); } };`, errors },
      { code: `const f: CanActivateFn = async () => { if (await something()) {} return inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { for await (const x of xs) {} return inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { for await (const x of xs) { inject(A); } };`, errors },
      { code: `const f: CanActivateFn = async () => { return (await something()) && inject(A); };`, errors },
      { code: `const f: CanActivateFn = async () => { await something(await other(), inject(A)); };`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `const f: CanActivateFn = () => () => inject(A);`, errors },
      { code: `const f: CanActivateFn = () => { const g = () => inject(A); return g; };`, errors },
    ],
  }));
});

describe("legacy class guards, resolvers and interceptors", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `@Injectable() class G implements CanActivate { canActivate() { return inject(A).check(); } }`,
      `@Injectable() class G implements CanActivateChild { canActivateChild() { return inject(A).check(); } }`,
      `@Injectable() class G implements CanDeactivate<C> { canDeactivate() { return inject(A).check(); } }`,
      `@Injectable() class G implements CanMatch { canMatch() { return inject(A).check(); } }`,
      `@Injectable() class G implements Resolve<D> { resolve() { return inject(A).get(); } }`,
      `@Injectable() class I implements HttpInterceptor { intercept(req, next) { return next.handle(inject(A).change(req)); } }`,
      // Any Angular decorator, multiple interfaces
      `@Service() class G implements CanActivate { canActivate() { return inject(A).check(); } }`,
      `@Injectable() class G implements Other, CanActivate { canActivate() { return inject(A).check(); } }`,
      `@Injectable() class G implements CanActivate, CanMatch { canMatch() { return inject(A).check(); } }`,
      // Nested blocks and expressions
      `@Injectable() class G implements CanActivate { canActivate() { const a = inject(A); if (a) { return inject(B); } return toUser(inject(C)); } }`,
      // Before `await`
      `@Injectable() class G implements CanActivate { async canActivate() { const a = inject(A); await a.check(); } }`,
      // Computed method name with a variable: its value is unknown, so it may be the guard method
      // ACCEPTED FALSE NEGATIVE: it is not reported even if it is another method, to avoid false positives (not used in Angular code)
      `@Injectable() class G implements CanActivate { [canActivate]() { return inject(A).check(); } }`,
      // Computed method name with a string
      `@Injectable() class G implements CanActivate { ['canActivate']() { return inject(A).check(); } }`,
    ],
    invalid: [
      // Method does not match the interface
      { code: `@Injectable() class G implements CanMatch { canActivate() { return inject(A).check(); } }`, errors },
      // No interface
      { code: `@Injectable() class G { canActivate() { return inject(A).check(); } }`, errors },
      // Computed method name with a variable in a class without a guard interface
      { code: `@Injectable() class G { [canActivate]() { return inject(A).check(); } }`, errors },
      // Computed method name with another string
      { code: `@Injectable() class G implements CanActivate { ['other']() { return inject(A).check(); } }`, errors },
      // Not an Angular class
      { code: `class G implements CanActivate { canActivate() { return inject(A).check(); } }`, errors },
      // Other method
      { code: `@Injectable() class G implements CanActivate { other() { return inject(A).check(); } }`, errors },
      // Callbacks
      { code: `@Injectable() class G implements CanActivate { canActivate() { return obs.pipe(map(() => inject(A))); } }`, errors },
      // After `await`
      { code: `@Injectable() class G implements CanActivate { async canActivate() { await something(); return inject(A); } }`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `@Injectable() class G implements CanActivate { canActivate() { return () => inject(A); } }`, errors },
    ],
  }));
});

describe("inline route functions", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `const routes: Routes = [{ path: '', canActivate: [() => inject(A).check()] }];`,
      `const routes: Routes = [{ path: '', canActivateChild: [() => inject(A).check()] }];`,
      `const routes: Routes = [{ path: '', canDeactivate: [() => inject(A).check()] }];`,
      `const routes: Routes = [{ path: '', canMatch: [() => inject(A).check()] }];`,
      `const routes: Routes = [{ path: '', resolve: { data: () => inject(A).get() } }];`,
      `const routes: Routes = [{ path: '', redirectTo: () => inject(A).url }];`,
      `const routes: Routes = [{ path: '', title: () => inject(A).title }];`,
      `const routes: Routes = [{ path: '', loadComponent: () => inject(A).load() }];`,
      `const routes: Routes = [{ path: '', loadChildren: () => inject(A).load() }];`,
      `const routes: Routes = [{ path: '', runGuardsAndResolvers: () => inject(A).check() }];`,
      `const routes: Routes = [{ path: '', children: [{ path: '', canActivate: [() => inject(A).check()] }] }];`,
      `export const routes: Routes = [{ path: '', canActivate: [() => inject(A).check()] }];`,
      `const route: Route = { path: '', canActivate: [() => inject(A).check()] };`,
      `const routes: Routes = [{ path: '', canActivate: [function () { return inject(A).check(); }] }];`,
      `const routes: Routes = [{ path: '', canActivate: [() => { return inject(A).check(); }] }];`,
      `const routes: Routes = [{ path: '', canActivate: [() => { if (cond) { return inject(A).check(); } }] }];`,
      // Local variables and nested expressions
      `const routes: Routes = [{ path: '', canActivate: [() => { const a = inject(A); return a.check(); }] }];`,
      `const routes: Routes = [{ path: '', redirectTo: () => { const a = inject(A); return a.url; } }];`,
      `const routes: Routes = [{ path: '', resolve: { data: () => toData(inject(A)) } }];`,
      // Before `await`
      `const routes: Routes = [{ path: '', canActivate: [async () => { inject(A); await something(); }] }];`,
    ],
    invalid: [
      // No type or other type
      { code: `const routes = [{ path: '', canActivate: [() => inject(A).check()] }];`, errors },
      { code: `const routes: Other = [{ path: '', canActivate: [() => inject(A).check()] }];`, errors },
      { code: `const routes: Route[] = [{ path: '', canActivate: [() => inject(A).check()] }];`, errors },
      { code: `const routes = [{ path: '', canActivate: [() => inject(A).check()] }] satisfies Routes;`, errors },
      { code: `provideRouter([{ path: '', canActivate: [() => inject(A).check()] }]);`, errors },
      // Not in a function, so it is run when the routes are defined, outside of the injection context
      { code: `const routes: Routes = [{ path: '', providers: [{ provide: B, useValue: inject(A) }] }];`, errors },
      { code: `const routes: Routes = [{ path: '', data: { a: inject(A) } }];`, errors },
      // Callbacks
      { code: `const routes: Routes = [{ path: '', canActivate: [() => obs.pipe(map(() => inject(A)))] }];`, errors },
      { code: `const routes: Routes = [{ path: '', canActivate: [wrap(() => inject(A))] }];`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `const routes: Routes = [{ path: '', canActivate: [() => { const g = () => inject(A); return g; }] }];`, errors },
      // After `await`
      { code: `const routes: Routes = [{ path: '', canActivate: [async () => { await something(); return inject(A); }] }];`, errors },
    ],
  }));
});

describe("factories", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // Provider factory
      `const p = { provide: T, useFactory: () => inject(A) };`,
      `const p = { useFactory: () => inject(A), provide: T };`,
      `const p = { provide: T, useFactory: function () { return inject(A); } };`,
      `const p = { provide: T, useFactory: () => { const a = inject(A); return a; } };`,
      `const p = { provide: T, useFactory: () => toUser(inject(A)) };`,
      `const p = { provide: T, useFactory: () => ({ api: inject(A) }) };`,
      `@Component({ providers: [{ provide: T, useFactory: () => inject(A) }] }) class C {}`,
      `bootstrapApplication(App, { providers: [{ provide: T, useFactory: () => inject(A) }] });`,
      `const ps = xs.map((x) => ({ provide: x, useFactory: () => inject(A) }));`,
      // `InjectionToken` factory
      `const T = new InjectionToken('t', { factory: () => inject(A) });`,
      `const T = new InjectionToken<A>('t', { providedIn: 'root', factory: () => inject(A) });`,
      `const T = new InjectionToken('t', { factory: () => { const a = inject(A); return a; } });`,
      // `@Injectable()` factory
      `@Injectable({ providedIn: 'root', useFactory: () => inject(A) }) class S {}`,
      // `@Service()` factory
      `@Service({ factory: () => inject(A) }) class S {}`,
      // Quoted and computed string `useFactory` keys
      `const p = { provide: T, 'useFactory': () => inject(A) };`,
      `const p = { provide: T, ['useFactory']: () => inject(A) };`,
      `const p = { ['provide']: T, useFactory: () => inject(A) };`,
      `const T = new InjectionToken('t', { ['factory']: () => inject(A) });`,
      // Computed keys with a variable: their value is unknown, so they may be `provide`, `useFactory` or `factory`
      // ACCEPTED FALSE NEGATIVE: they are not reported even if they are other properties, to avoid false positives (not used in Angular code)
      `const p = { [provide]: T, useFactory: () => inject(A) };`,
      `const p = { provide: T, [useFactory]: () => inject(A) };`,
      `const T = new InjectionToken('t', { [factory]: () => inject(A) });`,
    ],
    invalid: [
      // `useFactory` without `provide`
      { code: `const p = { useFactory: () => inject(A) };`, errors },
      // Computed key with a variable, but nothing else making it a factory: the function's own key does not count as `provide`
      { code: `const p = { [key]: () => inject(A) };`, errors },
      { code: `const p = { other: T, [key]: () => inject(A) };`, errors },
      { code: `const p = { provide: T, ['other']: () => inject(A) };`, errors },
      // Other property names
      { code: `const p = { provide: T, factory: () => inject(A) };`, errors },
      { code: `const T = new InjectionToken('t', { other: () => inject(A) });`, errors },
      // Not an `InjectionToken`
      { code: `const T = new Other('t', { factory: () => inject(A) });`, errors },
      { code: `const T = new Other('t', { factory: () => ({ api: inject(A) }) });`, errors },
      { code: `const T = new ng.InjectionToken('t', { factory: () => inject(A) });`, errors },
      // Decorator mismatch
      { code: `@Injectable({ factory: () => inject(A) }) class S {}`, errors },
      { code: `@Service({ useFactory: () => inject(A) }) class S {}`, errors },
      { code: `@Other({ useFactory: () => inject(A) }) class S {}`, errors },
      // Callbacks
      { code: `const p = { provide: T, useFactory: () => obs.pipe(map(() => inject(A))) };`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `const p = { provide: T, useFactory: () => () => inject(A) };`, errors },
      { code: `const p = { provide: T, useFactory: () => ({ get: () => inject(A) }) };`, errors },
      { code: `const T = new InjectionToken('t', { factory: () => () => inject(A) });`, errors },
      // After `await`
      { code: `const p = { provide: T, useFactory: async () => { await something(); return inject(A); } };`, errors },
    ],
  }));
});

describe("functions with injection context", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      // `runInInjectionContext()`
      `runInInjectionContext(injector, () => inject(A));`,
      `runInInjectionContext(injector, () => { inject(A); });`,
      `runInInjectionContext(injector, () => { const a = inject(A); });`,
      `runInInjectionContext(injector, function () { return inject(A); });`,
      `runInInjectionContext(injector, () => { if (cond) { inject(A); } });`,
      `runInInjectionContext(injector, async () => { inject(A); await something(); });`,
      `TestBed.runInInjectionContext(() => inject(A));`,
      `TestBed.runInInjectionContext(() => { const a = inject(A); });`,
      // Nested in another expression
      `runInInjectionContext(injector, () => toUser(inject(A)));`,
      `runInInjectionContext(injector, () => { const user = toUser(inject(A)); });`,
      `runInInjectionContext(injector, () => inject(A).init());`,
      `runInInjectionContext(injector, () => obs.pipe(takeUntilDestroyed(inject(A))));`,
      `TestBed.runInInjectionContext(() => toUser(inject(A)));`,
      // `TestBed` instance from `getTestBed()`
      `testBed.runInInjectionContext(() => inject(A));`,
      `getTestBed().runInInjectionContext(() => inject(A));`,
      // `EnvironmentInjector.runInContext()`
      `injector.runInContext(() => inject(A));`,
      `this.injector.runInContext(() => { const a = inject(A); });`,
      `@Component() class C { constructor() { inject(EnvironmentInjector).runInContext(() => inject(A)); } }`,
      // ACCEPTED FALSE NEGATIVE: methods are name-based, whatever the object (the check only skips reports)
      `Other.runInInjectionContext(() => inject(A));`,
      // Async application initialization
      `provideAppInitializer(() => inject(A));`,
      `provideAppInitializer(() => { const a = inject(A); return a.init(); });`,
      `provideAppInitializer(() => toUser(inject(A)));`,
      `provideAppInitializer(() => inject(A).init());`,
      // Sync application initialization
      `providePlatformInitializer(() => { const a = inject(A); a.init(); });`,
      `provideEnvironmentInitializer(() => { const a = inject(A); a.init(); });`,
      `providePlatformInitializer(() => { inject(A).init(); });`,
      `provideEnvironmentInitializer(() => { inject(A).init(); });`,
      // Function in an options object
      `withViewTransitions({ onViewTransitionCreated: () => { const a = inject(A); a.init(); } });`,
      `withViewTransitions({ onViewTransitionCreated: () => { inject(A).init(); } });`,
      `provideWebMcpTools(() => { const a = inject(A); a.register(); });`,
      `provideWebMcpTools(() => { inject(A).register(); });`,
      // Workaround for the `runInInjectionContext()` done before in the call stack limitation: assert the injection context in the called function
      `function f() { assertInInjectionContext(f); return inject(A); } runInInjectionContext(injector, () => f());`,
    ],
    invalid: [
      // Other functions
      { code: `other(injector, () => inject(A));`, errors },
      { code: `TestBed.other(() => inject(A));`, errors },
      { code: `injector.other(() => inject(A));`, errors },
      // Callback not inside the method call
      { code: `injector.runInContext(cb); const f = () => inject(A);`, errors },
      // After `await`
      { code: `injector.runInContext(async () => { await something(); inject(A); });`, errors },
      // Callbacks
      { code: `runInInjectionContext(injector, () => { obs.subscribe(() => inject(A)); });`, errors },
      { code: `provideAppInitializer(() => { obs.subscribe(() => inject(A)); });`, errors },
      // After `await`
      { code: `runInInjectionContext(injector, async () => { await something(); inject(A); });`, errors },
      { code: `runInInjectionContext(injector, async () => { const x = await something(); inject(A); });`, errors },
      { code: `TestBed.runInInjectionContext(async () => { await something(); inject(A); });`, errors },
      { code: `provideAppInitializer(async () => { await something(); inject(A); });`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `runInInjectionContext(injector, () => { const f = () => inject(A); });`, errors },
      { code: `withViewTransitions({ onViewTransitionCreated: () => { const f = () => inject(A); } });`, errors },
      // Outside of the `runInContext()` callback
      { code: `inject(EnvironmentInjector).runInContext(() => {});`, errors },
      // ACCEPTED FALSE POSITIVE: `runInInjectionContext()` done before in the call stack, `assertInInjectionContext()` should be used in the function
      { code: `function f() { return inject(A); } runInInjectionContext(injector, () => f());`, errors },
    ],
  }));
});

describe("assertInInjectionContext()", () => {
  testRule(rule, withImport(importDeclaration, {
    valid: [
      `function f() { assertInInjectionContext(f); return inject(A); }`,
      `function f() { assertInInjectionContext(f); const a = inject(A); return a; }`,
      `function f() { assertInInjectionContext(f); return toUser(inject(A)); }`,
      `const f = () => { assertInInjectionContext(f); return inject(A); };`,
      `const f = function () { assertInInjectionContext(f); return inject(A); };`,
      `class C { m() { assertInInjectionContext(this.m); return inject(A); } }`,
      // Conditional assertion
      `function f(injector) { if (!injector) { assertInInjectionContext(f); } return inject(A); }`,
      `function f(injector) { if (!injector) { other(); assertInInjectionContext(f); } return inject(A); }`,
      // The assertion declares that the function must be called in an injection context, wherever it is placed: misuse fails either way
      `function f() { const a = inject(A); assertInInjectionContext(f); return a; }`,
      // Call nested in another block
      `function f() { assertInInjectionContext(f); if (cond) { return inject(A); } }`,
      `function f() { assertInInjectionContext(f); try { return inject(A); } catch {} }`,
      `function f() { assertInInjectionContext(f); for (const x of xs) { inject(A); } }`,
      // Before `await`
      `async function f() { assertInInjectionContext(f); const a = inject(A); await something(); return a; }`,
    ],
    invalid: [
      // No assertion, or another assertion
      { code: `function f() { return inject(A); }`, errors },
      { code: `function f() { other(f); return inject(A); }`, errors },
      { code: `function f() { ng.assertInInjectionContext(f); return inject(A); }`, errors },
      // Assertion in another block
      { code: `function f() { assertInInjectionContext(f); } function g() { return inject(A); }`, errors },
      { code: `function f() { { assertInInjectionContext(f); } return inject(A); }`, errors },
      // Assertion not as a statement
      { code: `function f() { const x = assertInInjectionContext(f); return inject(A); }`, errors },
      // Conditional assertion not in a block
      { code: `function f(injector) { if (!injector) assertInInjectionContext(f); return inject(A); }`, errors },
      // Assertion in the `else` branch
      { code: `function f(injector) { if (injector) {} else { assertInInjectionContext(f); } return inject(A); }`, errors },
      // Callbacks
      { code: `function f() { assertInInjectionContext(f); obs.subscribe(() => inject(A)); }`, errors },
      // Nested functions, which may be run later, outside of the injection context
      { code: `function f() { assertInInjectionContext(f); return () => inject(A); }`, errors },
      // The assertion only covers the synchronous part of the function
      { code: `async function f() { assertInInjectionContext(f); await something(); return inject(A); }`, errors },
    ],
  }));
});

describe("all special injection contexts are enabled", () => {
  testRule(rule, withImport(importDeclaration, injectionContextsCases(`inject(A)`, {
    routing: true,
    http: true,
    factories: true,
    asyncAppInitialization: true,
    syncAppInitialization: true,
  }, errors)));
});

describe("same name imported from another library", () => {
  testRule(rule, {
    valid: [
      `import { inject } from "vitest";

const value = inject("key");`,
    ],
    invalid: [],
  });
});
