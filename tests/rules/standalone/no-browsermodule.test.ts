import * as rule from "../../../src/rules/standalone/no-browsermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowsermodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { BrowserModule } from "@angular/platform-browser";`,
    `import { Other, BrowserModule } from "@angular/platform-browser";`,
    // Type-only imports are still ImportSpecifier
    `import type { BrowserModule } from "@angular/platform-browser";`,
    `import { type BrowserModule } from "@angular/platform-browser";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { BrowserModule as Alias } from "@angular/platform-browser";`,
    `import { Other as BrowserModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { BrowserModule as Alias } from "@angular/platform-browser";

@NgModule({
  imports: [Alias],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    // Look-alike names (exact name match only)
    `@NgModule({
  imports: [MyBrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [BrowserModules],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [BrowserModuleRef],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [browserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [BrowserAnimationsModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [BrowserTestingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    `@NgModule({
  imports: [BrowserDynamicTestingModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "BrowserModule";`,
    `// BrowserModule`,
    `const value = ng["BrowserModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

const a = BrowserModule;
const b = [BrowserModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/platform-browser";

const a = ng.BrowserModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.BrowserModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `BrowserModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: BrowserModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof BrowserModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[BrowserModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class BrowserModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is BrowserModule: the specifier is not reported, but usages are
    {
      code: `import { Other as BrowserModule } from "other-lib";

const a = BrowserModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import BrowserModule from "@angular/platform-browser";`,
      errors: [error],
    },
    {
      code: `import * as BrowserModule from "@angular/platform-browser";`,
      errors: [error],
    },
    {
      code: `import BrowserModule = require("@angular/platform-browser");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { BrowserModule as Alias } from "@angular/platform-browser";`,
      errors: [error],
    },
    {
      code: `export * as BrowserModule from "@angular/platform-browser";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { BrowserModule } from "@angular/platform-browser";`,
      errors: [error, error],
    },
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

export { BrowserModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { BrowserModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { BrowserModule };`,
      errors: [error, error],
    },
    {
      code: `const { BrowserModule } = a;`,
      errors: [error, error],
    },
  ],
});
