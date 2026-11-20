import * as rule from "../../../src/rules/functional/no-canactivatechild-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCanactivatechildClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanActivateChildFn = () => true;`,
    /* Import only */
    `import { CanActivateChild } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanActivate {}`,
    /* Look-alike names */
    `class A implements CanActivateChildFn, MyCanActivateChild, CanActivateChilds {}`,
    /* `extends` instead of `implements` */
    `class A extends CanActivateChild {}`,
    `interface A extends CanActivateChild {}`,
    /* Type usage (not an `implements` clause) */
    `let a: CanActivateChild;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.CanActivateChild {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { CanActivateChild as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements CanActivateChild {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements CanActivateChild {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements CanActivateChild<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, CanActivateChild {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements CanActivateChild {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements CanActivateChild {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { CanActivateChild } from '@angular/router'; class A implements CanActivateChild {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements CanActivateChild {} class B implements CanActivateChild {}`, errors: [error, error] },
  ],
});
