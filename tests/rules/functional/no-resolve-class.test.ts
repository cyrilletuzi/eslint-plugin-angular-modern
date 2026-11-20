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
    `import { Resolve } from '@angular/router'; class A extends Resolve {}`,
    `import { Resolve } from '@angular/router'; interface A extends Resolve {}`,
    /* Type usage (not an `implements` clause) */
    `import { Resolve } from '@angular/router'; let a: Resolve;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { Resolve } from '@angular/router'; class A implements router.Resolve {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { Resolve } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements Resolve {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { Resolve } from '@angular/router'; class A implements Resolve {}`, errors: [error] },
    /* With type arguments */
    { code: `import { Resolve } from '@angular/router'; class A implements Resolve<Data> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { Resolve } from '@angular/router'; class A extends B implements OnDestroy, Resolve {}`, errors: [error] },
    /* Class expression */
    { code: `import { Resolve } from '@angular/router'; const A = class implements Resolve {};`, errors: [error] },
    /* Abstract class */
    { code: `import { Resolve } from '@angular/router'; abstract class A implements Resolve {}`, errors: [error] },
    /* Several classes */
    { code: `import { Resolve } from '@angular/router'; class A implements Resolve {} class B implements Resolve {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { Resolve as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
