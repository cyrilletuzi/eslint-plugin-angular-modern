import * as rule from "../../../src/rules/functional/no-canactivate-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCanactivateClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanActivateFn = () => true;`,
    /* Import only */
    `import { CanActivate } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanActivateChild {}`,
    /* Look-alike names */
    `class A implements CanActivateFn, MyCanActivate, CanActivates {}`,
    /* `extends` instead of `implements` */
    `class A extends CanActivate {}`,
    `interface A extends CanActivate {}`,
    /* Type usage (not an `implements` clause) */
    `let a: CanActivate;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.CanActivate {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { CanActivate as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements CanActivate {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements CanActivate {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements CanActivate<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, CanActivate {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements CanActivate {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements CanActivate {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { CanActivate } from '@angular/router'; class A implements CanActivate {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements CanActivate {} class B implements CanActivate {}`, errors: [error, error] },
  ],
});
