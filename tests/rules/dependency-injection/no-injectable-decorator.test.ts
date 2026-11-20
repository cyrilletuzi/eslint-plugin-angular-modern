import * as rule from "../../../src/rules/dependency-injection/no-injectable-decorator.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noInjectableDecorator" } as const;

testRule(rule, {
  valid: [
    /* Modern `@Service()` */
    `@Service() class A {}`,
    `@Service({ autoProvided: false }) class A {}`,
    `@Service({ factory: () => '' }) class A {}`,
    /* `providedIn: 'platform'` exception, with both quote styles */
    `@Injectable({ providedIn: 'platform' }) class A {}`,
    `@Injectable({ providedIn: "platform" }) class A {}`,
    /* Exception with other properties */
    `@Injectable({ useFactory: () => '', providedIn: 'platform' }) class A {}`,
    /* Decorator without call (selector requires `expression.callee`) */
    `@Injectable class A {}`,
    /* Member expression decorator */
    `@ng.Injectable() class A {}`,
    /* Look-alike names */
    `@Injectables() class A {}`,
    `@injectable() class A {}`,
    `@Inject(TOKEN) class A {}`,
    /* Import and non-decorator usages */
    `import { Injectable } from '@angular/core';`,
    `const a = Injectable();`,
  ],
  invalid: [
    /* No config */
    { code: `@Injectable() class A {}`, errors: [error] },
    /* Empty config */
    { code: `@Injectable({}) class A {}`, errors: [error] },
    /* `providedIn` values other than 'platform' */
    { code: `@Injectable({ providedIn: 'root' }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: 'any' }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: null }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: SomeModule }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: 'Platform' }) class A {}`, errors: [error] },
    /* Other config properties */
    { code: `@Injectable({ providedIn: 'root', useFactory: () => '' }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: 'root', useValue: '' }) class A {}`, errors: [error] },
    { code: `@Injectable({ providedIn: 'root', useClass: B }) class A {}`, errors: [error] },
    /* 'platform' value on another key */
    { code: `@Injectable({ scope: 'platform' }) class A {}`, errors: [error] },
    /* Config which is not an object literal */
    { code: `const config = { providedIn: 'platform' } as const; @Injectable(config) class A {}`, errors: [error] },
    /* Spread config */
    { code: `@Injectable({ ...config }) class A {}`, errors: [error] },
    // SUSPECTED BUG: template literal `platform` is equivalent to 'platform' but is a TemplateLiteral, not a Literal
    { code: "@Injectable({ providedIn: `platform` }) class A {}", errors: [error] },
    // SUSPECTED BUG: string-quoted key `'providedIn'` is not found by getDecoratorProperty (only Identifier keys)
    { code: `@Injectable({ 'providedIn': 'platform' }) class A {}`, errors: [error] },
    /* Generic call */
    { code: `@Injectable<unknown>() class A {}`, errors: [error] },
    /* Exported class, decorator among others */
    { code: `@Foo() @Injectable() export class A {}`, errors: [error] },
    /* Any decorator position is matched by the selector */
    { code: `class A { @Injectable() a: string; }`, errors: [error] },
    /* Several classes */
    {
      code: `
        @Injectable() class A {}
        @Injectable({ providedIn: 'platform' }) class B {}
        @Injectable({ providedIn: 'root' }) class C {}
      `,
      errors: [error, error],
    },
  ],
});
