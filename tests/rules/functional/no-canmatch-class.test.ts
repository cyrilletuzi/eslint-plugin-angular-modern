import * as rule from "../../../src/rules/functional/no-canmatch-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCanmatchClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanMatchFn = () => true;`,
    /* Import only */
    `import { CanMatch } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanLoad {}`,
    /* Look-alike names */
    `class A implements CanMatchFn, MyCanMatch, CanMatchs {}`,
    /* `extends` instead of `implements` */
    `class A extends CanMatch {}`,
    `interface A extends CanMatch {}`,
    /* Type usage (not an `implements` clause) */
    `let a: CanMatch;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.CanMatch {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { CanMatch as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements CanMatch {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements CanMatch {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements CanMatch<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, CanMatch {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements CanMatch {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements CanMatch {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { CanMatch } from '@angular/router'; class A implements CanMatch {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements CanMatch {} class B implements CanMatch {}`, errors: [error, error] },
  ],
});
