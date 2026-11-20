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
    `import { CanLoad } from '@angular/router'; class A extends CanLoad {}`,
    `import { CanLoad } from '@angular/router'; interface A extends CanLoad {}`,
    /* Type usage (not an `implements` clause) */
    `import { CanLoad } from '@angular/router'; let a: CanLoad;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { CanLoad } from '@angular/router'; class A implements router.CanLoad {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { CanLoad } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements CanLoad {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { CanLoad } from '@angular/router'; class A implements CanLoad {}`, errors: [error] },
    /* With type arguments */
    { code: `import { CanLoad } from '@angular/router'; class A implements CanLoad<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { CanLoad } from '@angular/router'; class A extends B implements OnDestroy, CanLoad {}`, errors: [error] },
    /* Class expression */
    { code: `import { CanLoad } from '@angular/router'; const A = class implements CanLoad {};`, errors: [error] },
    /* Abstract class */
    { code: `import { CanLoad } from '@angular/router'; abstract class A implements CanLoad {}`, errors: [error] },
    /* Several classes */
    { code: `import { CanLoad } from '@angular/router'; class A implements CanLoad {} class B implements CanLoad {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { CanLoad as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
