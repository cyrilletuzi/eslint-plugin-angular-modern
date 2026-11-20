import * as rule from "../../../src/rules/functional/no-canload-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCanloadClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanMatchFn = () => true;`,
    /* Import only */
    `import { CanLoad } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanMatch {}`,
    /* Look-alike names */
    `class A implements CanMatchFn, MyCanLoad, CanLoads {}`,
    /* `extends` instead of `implements` */
    `class A extends CanLoad {}`,
    `interface A extends CanLoad {}`,
    /* Type usage (not an `implements` clause) */
    `let a: CanLoad;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.CanLoad {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { CanLoad as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements CanLoad {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements CanLoad {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements CanLoad<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, CanLoad {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements CanLoad {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements CanLoad {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { CanLoad } from '@angular/router'; class A implements CanLoad {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements CanLoad {} class B implements CanLoad {}`, errors: [error, error] },
  ],
});
