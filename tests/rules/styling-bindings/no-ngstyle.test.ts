import * as rule from "../../../src/rules/styling-bindings/no-ngstyle.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgstyle" } as const;

testRule(rule, {
  valid: [
    /* Import specifier (both imported and local Identifiers are skipped) */
    `import { NgStyle } from '@angular/common';`,
    `import { Other, NgStyle } from '@angular/common';`,
    /* Aliased import: the imported name is skipped */
    `import { NgStyle as Alias } from '@angular/common';`,
    /* Look-alike names */
    `const a = [MyNgStyle, NgStyles, ngstyle];`,
    /* String, not a usage */
    `import { NgStyle } from '@angular/common'; const a = 'NgStyle';`,
    /* Not reported: namespace import member */
    `import * as ng from '@angular/common'; const a = ng.NgStyle;`,
    /* Not reported: default and namespace imports with the same name */
    `import NgStyle from '@angular/common';`,
    `import * as NgStyle from '@angular/common';`,
    // Not reported: re-export without import (not a usage)
    `export { NgStyle } from '@angular/common';`,
    // Not reported: unrelated object key with the same name
    `import { NgStyle } from '@angular/common'; const o = { NgStyle: true };`,
  ],
  invalid: [
    /* Classic usage */
    { code: `import { NgStyle } from '@angular/common'; @Component({ imports: [NgStyle], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {}`, errors: [error] },
    /* Injection */
    { code: `import { NgStyle } from '@angular/common'; const a = inject(NgStyle);`, errors: [error] },
    /* Type usage */
    { code: `import { NgStyle } from '@angular/common'; let a: NgStyle;`, errors: [error] },
    /* Several usages */
    { code: `import { NgStyle } from '@angular/common'; @Component({ imports: [NgStyle], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {} const a = inject(NgStyle);`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { NgStyle as Alias } from '@angular/common'; @Component({ imports: [Alias], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {}`, errors: [error] },
  ],
});
