import * as rule from "../../../src/rules/functional/no-candeactivate-class.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCandeactivateClass" } as const;

testRule(rule, {
  valid: [
    /* Modern functional alternative */
    `export const fn: CanDeactivateFn = () => true;`,
    /* Import only */
    `import { CanDeactivate } from '@angular/router';`,
    /* Class without `implements` */
    `@Injectable() class A { method() { return true; } }`,
    /* Other interfaces */
    `class A implements OnInit, CanActivate {}`,
    /* Look-alike names */
    `class A implements CanDeactivateFn, MyCanDeactivate, CanDeactivates {}`,
    /* `extends` instead of `implements` */
    `import { CanDeactivate } from '@angular/router'; class A extends CanDeactivate {}`,
    `import { CanDeactivate } from '@angular/router'; interface A extends CanDeactivate {}`,
    /* Type usage (not an `implements` clause) */
    `import { CanDeactivate } from '@angular/router'; let a: CanDeactivate;`,
    // ACCEPTED FALSE NEGATIVE: with a namespace import, the qualified name (`router.X`) is not reported
    `import { CanDeactivate } from '@angular/router'; class A implements router.CanDeactivate {}`,
  ],
  invalid: [
    /* Classic class-based usage */
    { code: `import { CanDeactivate } from '@angular/router'; @Injectable({ providedIn: 'root' }) export class A implements CanDeactivate {}`, errors: [error] },
    /* Without Angular decorator */
    { code: `import { CanDeactivate } from '@angular/router'; class A implements CanDeactivate {}`, errors: [error] },
    /* With type arguments */
    { code: `import { CanDeactivate } from '@angular/router'; class A implements CanDeactivate<SomeComponent> {}`, errors: [error] },
    /* Among other interfaces */
    { code: `import { CanDeactivate } from '@angular/router'; class A extends B implements OnDestroy, CanDeactivate {}`, errors: [error] },
    /* Class expression */
    { code: `import { CanDeactivate } from '@angular/router'; const A = class implements CanDeactivate {};`, errors: [error] },
    /* Abstract class */
    { code: `import { CanDeactivate } from '@angular/router'; abstract class A implements CanDeactivate {}`, errors: [error] },
    /* Several classes */
    { code: `import { CanDeactivate } from '@angular/router'; class A implements CanDeactivate {} class B implements CanDeactivate {}`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { CanDeactivate as Alias } from '@angular/router'; class A implements Alias {}`, errors: [error] },
  ],
});
