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
    `import { CanMatch } from '@angular/router'; class A extends CanMatch {}`,
    `import { CanMatch } from '@angular/router'; interface A extends CanMatch {}`,
    /* Type usage (not an `implements` clause) */
    `import { CanMatch } from '@angular/router'; let a: CanMatch;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { CanMatch } from '@angular/router'; class A implements router.CanMatch {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { CanMatch } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements CanMatch {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { CanMatch } from '@angular/router'; class A implements CanMatch {}`, errors: [error] },
    /* With type arguments */
    { code: `import { CanMatch } from '@angular/router'; class A implements CanMatch<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { CanMatch } from '@angular/router'; class A extends B implements OnDestroy, CanMatch {}`, errors: [error] },
    /* Class expression */
    { code: `import { CanMatch } from '@angular/router'; const A = class implements CanMatch {};`, errors: [error] },
    /* Abstract class */
    { code: `import { CanMatch } from '@angular/router'; abstract class A implements CanMatch {}`, errors: [error] },
    /* Several classes */
    { code: `import { CanMatch } from '@angular/router'; class A implements CanMatch {} class B implements CanMatch {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { CanMatch as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
