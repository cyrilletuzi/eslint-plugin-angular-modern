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
    // SUSPECTED BUG: an aliased import is not followed, the usage of the alias is not reported
    `import { NgStyle as Alias } from '@angular/common'; @Component({ imports: [Alias], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {}`,
    /* Look-alike names */
    `const a = [MyNgStyle, NgStyles, ngstyle];`,
    /* String, not an Identifier */
    `const a = 'NgStyle';`,
  ],
  invalid: [
    /* Classic usage */
    { code: `@Component({ imports: [NgStyle], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {}`, errors: [error] },
    /* Import and usage: only the usage is reported */
    { code: `import { NgStyle } from '@angular/common'; @Component({ imports: [NgStyle], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {}`, errors: [error] },
    /* Injection */
    { code: `const a = inject(NgStyle);`, errors: [error] },
    /* Type usage */
    { code: `let a: NgStyle;`, errors: [error] },
    /* Namespace import member */
    { code: `import * as ng from '@angular/common'; const a = ng.NgStyle;`, errors: [error] },
    /* Default and namespace-like import specifiers are not ImportSpecifier */
    { code: `import NgStyle from '@angular/common';`, errors: [error] },
    { code: `import * as NgStyle from '@angular/common';`, errors: [error] },
    /* Re-export: both local and exported Identifiers are visited */
    // SUSPECTED BUG: a single re-export is reported twice
    { code: `export { NgStyle } from '@angular/common';`, errors: [error, error] },
    // SUSPECTED BUG: any non-import Identifier with this name is reported, even an unrelated object key
    { code: `const o = { NgStyle: true };`, errors: [error] },
    /* Several usages */
    { code: `@Component({ imports: [NgStyle], template: '<div [ngStyle]="{ color: c }"></div>' }) class A {} const a = inject(NgStyle);`, errors: [error, error] },
  ],
});
