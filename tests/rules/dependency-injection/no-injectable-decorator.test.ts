import * as rule from "../../../src/rules/dependency-injection/no-injectable-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noInjectableDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `@Service()` */
    `import { Injectable } from '@angular/core'; @Service() class A {}`,
    `import { Injectable } from '@angular/core'; @Service({ autoProvided: false }) class A {}`,
    `import { Injectable } from '@angular/core'; @Service({ factory: () => '' }) class A {}`,
    /* `providedIn: 'platform'` exception, with both quote styles */
    `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'platform' }) class A {}`,
    `import { Injectable } from '@angular/core'; @Injectable({ providedIn: "platform" }) class A {}`,
    /* Exception with other properties */
    `import { Injectable } from '@angular/core'; @Injectable({ useFactory: () => '', providedIn: 'platform' }) class A {}`,
    /* Decorator without call (selector requires `expression.callee`) */
    `import { Injectable } from '@angular/core'; @Injectable class A {}`,
    /* Member expression decorator */
    `import { Injectable } from '@angular/core'; @ng.Injectable() class A {}`,
    /* Look-alike names */
    `import { Injectable } from '@angular/core'; @Injectables() class A {}`,
    `import { Injectable } from '@angular/core'; @injectable() class A {}`,
    `import { Injectable } from '@angular/core'; @Inject(TOKEN) class A {}`,
    /* Import and non-decorator usages */
    `import { Injectable } from '@angular/core';`,
    `import { Injectable } from '@angular/core'; const a = Injectable();`,
    /* Same name imported from another library is not reported */
    `import { Injectable } from '@nestjs/common'; @Injectable() class A {}`,
  ],
  invalid: [
    /* No config */
    { code: `import { Injectable } from '@angular/core'; @Injectable() class A {}`, errors: [error] },
    /* Empty config */
    { code: `import { Injectable } from '@angular/core'; @Injectable({}) class A {}`, errors: [error] },
    /* `providedIn` values other than 'platform' */
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'root' }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'any' }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: null }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: SomeModule }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'Platform' }) class A {}`, errors: [error] },
    /* Other config properties */
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'root', useFactory: () => '' }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'root', useValue: '' }) class A {}`, errors: [error] },
    { code: `import { Injectable } from '@angular/core'; @Injectable({ providedIn: 'root', useClass: B }) class A {}`, errors: [error] },
    /* 'platform' value on another key */
    { code: `import { Injectable } from '@angular/core'; @Injectable({ scope: 'platform' }) class A {}`, errors: [error] },
    /* Config which is not an object literal */
    { code: `import { Injectable } from '@angular/core'; const config = { providedIn: 'platform' } as const; @Injectable(config) class A {}`, errors: [error] },
    /* Spread config */
    { code: `import { Injectable } from '@angular/core'; @Injectable({ ...config }) class A {}`, errors: [error] },
    // SUSPECTED BUG: template literal `platform` is equivalent to 'platform' but is a TemplateLiteral, not a Literal
    { code: "import { Injectable } from '@angular/core'; @Injectable({ providedIn: `platform` }) class A {}", errors: [error] },
    // SUSPECTED BUG: string-quoted key `'providedIn'` is not found by getDecoratorProperty (only Identifier keys)
    { code: `import { Injectable } from '@angular/core'; @Injectable({ 'providedIn': 'platform' }) class A {}`, errors: [error] },
    /* Generic call */
    { code: `import { Injectable } from '@angular/core'; @Injectable<unknown>() class A {}`, errors: [error] },
    /* Exported class, decorator among others */
    { code: `import { Injectable } from '@angular/core'; @Foo() @Injectable() export class A {}`, errors: [error] },
    /* Any decorator position is matched by the selector */
    { code: `import { Injectable } from '@angular/core'; class A { @Injectable() a: string; }`, errors: [error] },
    /* Several classes */
    {
      code: `import { Injectable } from '@angular/core';
        @Injectable() class A {}
        @Injectable({ providedIn: 'platform' }) class B {}
        @Injectable({ providedIn: 'root' }) class C {}
      `,
      errors: [error, error],
    },
  ],
});
