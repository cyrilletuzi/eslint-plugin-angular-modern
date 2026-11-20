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
    `import { CanActivateChild } from '@angular/router'; class A extends CanActivateChild {}`,
    `import { CanActivateChild } from '@angular/router'; interface A extends CanActivateChild {}`,
    /* Type usage (not an `implements` clause) */
    `import { CanActivateChild } from '@angular/router'; let a: CanActivateChild;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { CanActivateChild } from '@angular/router'; class A implements router.CanActivateChild {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { CanActivateChild } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements CanActivateChild {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { CanActivateChild } from '@angular/router'; class A implements CanActivateChild {}`, errors: [error] },
    /* With type arguments */
    { code: `import { CanActivateChild } from '@angular/router'; class A implements CanActivateChild<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { CanActivateChild } from '@angular/router'; class A extends B implements OnDestroy, CanActivateChild {}`, errors: [error] },
    /* Class expression */
    { code: `import { CanActivateChild } from '@angular/router'; const A = class implements CanActivateChild {};`, errors: [error] },
    /* Abstract class */
    { code: `import { CanActivateChild } from '@angular/router'; abstract class A implements CanActivateChild {}`, errors: [error] },
    /* Several classes */
    { code: `import { CanActivateChild } from '@angular/router'; class A implements CanActivateChild {} class B implements CanActivateChild {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { CanActivateChild as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
