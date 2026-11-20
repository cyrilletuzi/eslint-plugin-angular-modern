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
    `import { CanActivate } from '@angular/router'; class A extends CanActivate {}`,
    `import { CanActivate } from '@angular/router'; interface A extends CanActivate {}`,
    /* Type usage (not an `implements` clause) */
    `import { CanActivate } from '@angular/router'; let a: CanActivate;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { CanActivate } from '@angular/router'; class A implements router.CanActivate {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { CanActivate } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements CanActivate {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { CanActivate } from '@angular/router'; class A implements CanActivate {}`, errors: [error] },
    /* With type arguments */
    { code: `import { CanActivate } from '@angular/router'; class A implements CanActivate<unknown> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { CanActivate } from '@angular/router'; class A extends B implements OnDestroy, CanActivate {}`, errors: [error] },
    /* Class expression */
    { code: `import { CanActivate } from '@angular/router'; const A = class implements CanActivate {};`, errors: [error] },
    /* Abstract class */
    { code: `import { CanActivate } from '@angular/router'; abstract class A implements CanActivate {}`, errors: [error] },
    /* Several classes */
    { code: `import { CanActivate } from '@angular/router'; class A implements CanActivate {} class B implements CanActivate {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { CanActivate as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
