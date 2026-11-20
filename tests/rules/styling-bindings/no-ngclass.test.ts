import * as rule from "../../../src/rules/styling-bindings/no-ngclass.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgclass" } as const;

testRule(rule, {
  valid: [
    /* Import specifier (both imported and local Identifiers are skipped) */
    `import { NgClass } from '@angular/common';`,
    `import { Other, NgClass } from '@angular/common';`,
    /* Aliased import: the imported name is skipped */
    `import { NgClass as Alias } from '@angular/common';`,
    /* Look-alike names */
    `const a = [MyNgClass, NgClasss, ngclass];`,
    /* String, not a usage */
    `import { NgClass } from '@angular/common'; const a = 'NgClass';`,
    /* Not reported: namespace import member */
    `import * as ng from '@angular/common'; const a = ng.NgClass;`,
    /* Not reported: default and namespace imports with the same name */
    `import NgClass from '@angular/common';`,
    `import * as NgClass from '@angular/common';`,
    // Not reported: re-export without import (not a usage)
    `export { NgClass } from '@angular/common';`,
    // Not reported: unrelated object key with the same name
    `import { NgClass } from '@angular/common'; const o = { NgClass: true };`,
  ],
  invalid: [
    /* Classic usage */
    { code: `import { NgClass } from '@angular/common'; @Component({ imports: [NgClass], template: '<div [ngClass]="{ a: true }"></div>' }) class A {}`, errors: [error] },
    /* Injection */
    { code: `import { NgClass } from '@angular/common'; const a = inject(NgClass);`, errors: [error] },
    /* Type usage */
    { code: `import { NgClass } from '@angular/common'; let a: NgClass;`, errors: [error] },
    /* Several usages */
    { code: `import { NgClass } from '@angular/common'; @Component({ imports: [NgClass], template: '<div [ngClass]="{ a: true }"></div>' }) class A {} const a = inject(NgClass);`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { NgClass as Alias } from '@angular/common'; @Component({ imports: [Alias], template: '<div [ngClass]="{ a: true }"></div>' }) class A {}`, errors: [error] },
  ],
});
