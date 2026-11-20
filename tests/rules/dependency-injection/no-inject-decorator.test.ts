import * as rule from "../../../src/rules/dependency-injection/no-inject-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noInjectDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `inject()` function */
    `@Component() class A { a = inject(A); }`,
    `@Component() class A { constructor() { const a = inject(TOKEN); } }`,
    /* `Inject()` call which is not a decorator */
    `const a = Inject(TOKEN);`,
    /* Decorator without call */
    `@Injectable() class A { constructor(@Inject a: A) {} }`,
    /* Member expression decorator */
    `@Injectable() class A { constructor(@ng.Inject(TOKEN) a: A) {} }`,
    /* Look-alike names */
    `@Injectable() class A { constructor(@Injectable() a: A) {} }`,
    `@Injectable() class A { constructor(@inject(TOKEN) a: A) {} }`,
    `@Injectable() class A { constructor(@InjectToken(TOKEN) a: A) {} }`,
    /* Import only */
    `import { Inject } from '@angular/core';`,
    /* Aliased import: the alias is not detected */
    `import { Inject as I } from '@angular/core'; @Injectable() class A { constructor(@I(TOKEN) a: A) {} }`,
  ],
  invalid: [
    /* Constructor parameter */
    { code: `@Injectable() class A { constructor(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    /* Parameter property */
    { code: `@Component() class A { constructor(@Inject(TOKEN) private readonly a: string) {} }`, errors: [error] },
    /* Combined with other parameter decorators */
    { code: `@Component() class A { constructor(@Optional() @Inject(TOKEN) a?: string) {} }`, errors: [error] },
    /* Several parameters */
    {
      code: `@Component() class A { constructor(@Inject(A) a: A, b: B, @Inject(C) c: C) {} }`,
      errors: [error, error],
    },
    /* No class decorator: any `@Inject()` decorator is reported */
    { code: `class A { constructor(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    /* Other decorator positions */
    { code: `class A { @Inject(TOKEN) a: string; }`, errors: [error] },
    { code: `class A { method(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    { code: `@Inject(TOKEN) class A {}`, errors: [error] },
    /* Without arguments and with generic */
    { code: `class A { constructor(@Inject() a: string) {} }`, errors: [error] },
    { code: `class A { constructor(@Inject<string>(TOKEN) a: string) {} }`, errors: [error] },
    /* Import is not reported, only the usage */
    {
      code: `import { Inject } from '@angular/core'; class A { constructor(@Inject(TOKEN) a: string) {} }`,
      errors: [error],
    },
  ],
});
