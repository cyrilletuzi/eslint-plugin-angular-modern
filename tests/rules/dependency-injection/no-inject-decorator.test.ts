import * as rule from "../../../src/rules/dependency-injection/no-inject-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noInjectDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `inject()` function */
    `import { Inject } from '@angular/core'; @Component() class A { a = inject(A); }`,
    `import { Inject } from '@angular/core'; @Component() class A { constructor() { const a = inject(TOKEN); } }`,
    /* `Inject()` call which is not a decorator */
    `import { Inject } from '@angular/core'; const a = Inject(TOKEN);`,
    /* Decorator without call */
    `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@Inject a: A) {} }`,
    /* Member expression decorator */
    `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@ng.Inject(TOKEN) a: A) {} }`,
    /* Look-alike names */
    `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@Injectable() a: A) {} }`,
    `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@inject(TOKEN) a: A) {} }`,
    `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@InjectToken(TOKEN) a: A) {} }`,
    /* Import only */
    `import { Inject } from '@angular/core';`,
    /* Same name imported from another library is not reported */
    `import { Inject } from '@nestjs/common'; @Injectable() class A { constructor(@Inject(TOKEN) a: A) {} }`,
  ],
  invalid: [
    /* Constructor parameter */
    { code: `import { Inject } from '@angular/core'; @Injectable() class A { constructor(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    /* Parameter property */
    { code: `import { Inject } from '@angular/core'; @Component() class A { constructor(@Inject(TOKEN) private readonly a: string) {} }`, errors: [error] },
    /* Combined with other parameter decorators */
    { code: `import { Inject } from '@angular/core'; @Component() class A { constructor(@Optional() @Inject(TOKEN) a?: string) {} }`, errors: [error] },
    /* Several parameters */
    {
      code: `import { Inject } from '@angular/core'; @Component() class A { constructor(@Inject(A) a: A, b: B, @Inject(C) c: C) {} }`,
      errors: [error, error],
    },
    /* No class decorator: any `@Inject()` decorator is reported */
    { code: `import { Inject } from '@angular/core'; class A { constructor(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    /* Other decorator positions */
    { code: `import { Inject } from '@angular/core'; class A { @Inject(TOKEN) a: string; }`, errors: [error] },
    { code: `import { Inject } from '@angular/core'; class A { method(@Inject(TOKEN) a: string) {} }`, errors: [error] },
    { code: `import { Inject } from '@angular/core'; @Inject(TOKEN) class A {}`, errors: [error] },
    /* Without arguments and with generic */
    { code: `import { Inject } from '@angular/core'; class A { constructor(@Inject() a: string) {} }`, errors: [error] },
    { code: `import { Inject } from '@angular/core'; class A { constructor(@Inject<string>(TOKEN) a: string) {} }`, errors: [error] },
    /* Aliased import is reported */
    { code: `import { Inject as I } from '@angular/core'; @Injectable() class A { constructor(@I(TOKEN) a: A) {} }`, errors: [error] },
  ],
});
