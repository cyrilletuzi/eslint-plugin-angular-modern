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
    // SUSPECTED BUG: an aliased import is not followed, the usage of the alias is not reported
    `import { NgClass as Alias } from '@angular/common'; @Component({ imports: [Alias], template: '<div [ngClass]="{ a: true }"></div>' }) class A {}`,
    /* Look-alike names */
    `const a = [MyNgClass, NgClasss, ngclass];`,
    /* String, not an Identifier */
    `const a = 'NgClass';`,
  ],
  invalid: [
    /* Classic usage */
    { code: `@Component({ imports: [NgClass], template: '<div [ngClass]="{ a: true }"></div>' }) class A {}`, errors: [error] },
    /* Import and usage: only the usage is reported */
    { code: `import { NgClass } from '@angular/common'; @Component({ imports: [NgClass], template: '<div [ngClass]="{ a: true }"></div>' }) class A {}`, errors: [error] },
    /* Injection */
    { code: `const a = inject(NgClass);`, errors: [error] },
    /* Type usage */
    { code: `let a: NgClass;`, errors: [error] },
    /* Namespace import member */
    { code: `import * as ng from '@angular/common'; const a = ng.NgClass;`, errors: [error] },
    /* Default and namespace-like import specifiers are not ImportSpecifier */
    { code: `import NgClass from '@angular/common';`, errors: [error] },
    { code: `import * as NgClass from '@angular/common';`, errors: [error] },
    /* Re-export: both local and exported Identifiers are visited */
    // SUSPECTED BUG: a single re-export is reported twice
    { code: `export { NgClass } from '@angular/common';`, errors: [error, error] },
    // SUSPECTED BUG: any non-import Identifier with this name is reported, even an unrelated object key
    { code: `const o = { NgClass: true };`, errors: [error] },
    /* Several usages */
    { code: `@Component({ imports: [NgClass], template: '<div [ngClass]="{ a: true }"></div>' }) class A {} const a = inject(NgClass);`, errors: [error, error] },
  ],
});
