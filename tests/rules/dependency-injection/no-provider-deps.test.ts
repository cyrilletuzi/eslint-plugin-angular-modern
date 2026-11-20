import * as rule from "../../../src/rules/dependency-injection/no-provider-deps.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noProviderDeps" } as const;

testRule(rule, {
  valid: [
    /* Modern provider with `inject()` */
    `const p = { provide: A, useFactory: () => { const b = inject(B); return b; } };`,
    /* `deps` without `provide` in the same object */
    `const o = { deps: [A] };`,
    `const o = { useFactory: () => '', deps: [A] };`,
    /* `provide` in the parent object, `deps` in a nested one */
    `const p = { provide: A, useValue: { deps: [B] } };`,
    /* `provide` nested, `deps` in the parent object */
    `const p = { config: { provide: A }, deps: [B] };`,
    /* Destructuring: parent is an ObjectPattern, not an ObjectExpression */
    `const { provide, deps } = provider;`,
    /* Type declarations are not Property nodes */
    `interface P { provide: A; deps: B[]; }`,
    `type P = { provide: A; deps: B[] };`,
    /* Class members */
    `class A { provide = A; deps = [B]; }`,
    /* Look-alike keys */
    `const p = { provide: A, useFactory: () => '', dependencies: [B] };`,
    `const p = { provide: A, useFactory: () => '', Deps: [B] };`,
    `const p = { provider: A, useFactory: () => '', deps: [B] };`,
    /* `provide` brought by a spread is not detected */
    `const p = { ...base, deps: [B] };`,
    /* Member access */
    `provider.deps = [B];`,
    // SUSPECTED BUG: string-quoted `'deps'` key is not matched (selector requires an Identifier key)
    `const p = { provide: A, useFactory: () => '', 'deps': [B] };`,
    // SUSPECTED BUG: string-quoted `'provide'` key is not detected as a provider
    `const p = { 'provide': A, useFactory: () => '', deps: [B] };`,
  ],
  invalid: [
    /* Classic factory provider */
    {
      code: `const p = { provide: A, useFactory: (b: B, c?: C) => '', deps: [B, [new Optional(), C]] };`,
      errors: [error],
    },
    /* `deps` before `provide` */
    { code: `const p = { deps: [B], provide: A, useFactory: (b: B) => '' };`, errors: [error] },
    /* Empty `deps` */
    { code: `const p = { provide: A, useFactory: () => '', deps: [] };`, errors: [error] },
    /* Shorthand `deps` and `provide` */
    { code: `const p = { provide, useFactory, deps };`, errors: [error] },
    /* `useClass` provider with `deps` */
    { code: `const p = { provide: A, useClass: B, deps: [C] };`, errors: [error] },
    /* Spread does not prevent detection */
    { code: `const p = { ...base, provide: A, deps: [B] };`, errors: [error] },
    /* `provide` as a method still counts (any Property) */
    { code: `const p = { provide() {}, deps: [B] };`, errors: [error] },
    /* Computed `[deps]` key is still an Identifier key */
    { code: `const p = { provide: A, [deps]: [B] };`, errors: [error] },
    /* Inside a `providers` array of a decorator */
    {
      code: `@Component({ providers: [{ provide: A, useFactory: (b: B) => b, deps: [B] }] }) class C {}`,
      errors: [error],
    },
    /* Inside `bootstrapApplication` / `ApplicationConfig` */
    {
      code: `bootstrapApplication(App, { providers: [{ provide: A, useFactory: (b: B) => b, deps: [B] }, { provide: C, useValue: 1 }] });`,
      errors: [error],
    },
    /* Several providers */
    {
      code: `const providers = [{ provide: A, deps: [] }, { provide: B, deps: [] }];`,
      errors: [error, error],
    },
  ],
});
