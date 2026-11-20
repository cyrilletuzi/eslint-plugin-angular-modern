import * as rule from "../../../src/rules/functional/no-candeactivate-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCandeactivateClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanDeactivateFn = () => true;`,
    /* Import only */
    `import { CanDeactivate } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanActivate {}`,
    /* Look-alike names */
    `class A implements CanDeactivateFn, MyCanDeactivate, CanDeactivates {}`,
    /* `extends` instead of `implements` */
    `class A extends CanDeactivate {}`,
    `interface A extends CanDeactivate {}`,
    /* Type usage (not an `implements` clause) */
    `let a: CanDeactivate;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.CanDeactivate {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { CanDeactivate as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements CanDeactivate {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements CanDeactivate {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements CanDeactivate<SomeComponent> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, CanDeactivate {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements CanDeactivate {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements CanDeactivate {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { CanDeactivate } from '@angular/router'; class A implements CanDeactivate {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements CanDeactivate {} class B implements CanDeactivate {}`, errors: [error, error] },
  ],
});
