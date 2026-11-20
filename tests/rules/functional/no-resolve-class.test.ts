import * as rule from "../../../src/rules/functional/no-resolve-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noResolveClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: ResolveFn = () => true;`,
    /* Import only */
    `import { Resolve } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, Resolver {}`,
    /* Look-alike names */
    `class A implements ResolveFn, MyResolve, Resolves {}`,
    /* `extends` instead of `implements` */
    `class A extends Resolve {}`,
    `interface A extends Resolve {}`,
    /* Type usage (not an `implements` clause) */
    `let a: Resolve;`,
    // SUSPECTED BUG: qualified name is a MemberExpression, without `name`, so it is not matched
    `class A implements router.Resolve {}`,
    // SUSPECTED BUG: an aliased import is not followed
    `import { Resolve as Alias } from '@angular/router'; class A implements Alias {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `@Injectable({ providedIn: 'root' }) export class A implements Resolve {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `class A implements Resolve {}`, errors: [error] },
    /* With type arguments */
    { code: `class A implements Resolve<Data> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `class A extends B implements OnDestroy, Resolve {}`, errors: [error] },
    /* Class expression */
    { code: `const A = class implements Resolve {};`, errors: [error] },
    /* Abstract class */
    { code: `abstract class A implements Resolve {}`, errors: [error] },
    /* Import and usage: only the `implements` clause is reported */
    { code: `import { Resolve } from '@angular/router'; class A implements Resolve {}`, errors: [error] },
    /* Several classes */
    { code: `class A implements Resolve {} class B implements Resolve {}`, errors: [error, error] },
  ],
});
