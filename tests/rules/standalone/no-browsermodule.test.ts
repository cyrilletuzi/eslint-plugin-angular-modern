import * as rule from "../../../src/rules/standalone/no-browsermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowsermodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { BrowserModule } from "@angular/platform-browser";`,
    `import { Other, BrowserModule } from "@angular/platform-browser";`,
    // Type-only imports alone are not reported either
    `import type { BrowserModule } from "@angular/platform-browser";`,
    `import { type BrowserModule } from "@angular/platform-browser";`,
    // Aliased imports alone are not reported either
    `import { BrowserModule as Alias } from "@angular/platform-browser";`,
    `import { Other as BrowserModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { BrowserModule } from "@angular/platform-browser"; const name = "BrowserModule";`,
    `import { BrowserModule } from "@angular/platform-browser"; // BrowserModule`,
    `import { BrowserModule } from "@angular/platform-browser"; const value = ng["BrowserModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [BrowserModule],
  bootstrap: [AppComponent],
})
export class AppModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/platform-browser";

const a = ng.BrowserModule;`,
    `import { BrowserModule } from "@angular/platform-browser"; const a = foo.bar.BrowserModule;`,
    // Not reported: local declaration with the same name
    `class BrowserModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as BrowserModule } from "other-lib";

const a = BrowserModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import BrowserModule from "@angular/platform-browser";`,
    `import * as BrowserModule from "@angular/platform-browser";`,
    `import { BrowserModule } from "@angular/platform-browser"; import BrowserModule = require("@angular/platform-browser");`,
    // Not reported: re-exports without import (not a usage)
    `export { BrowserModule as Alias } from "@angular/platform-browser";`,
    `export * as BrowserModule from "@angular/platform-browser";`,
    // Not reported: re-export without import (not a usage)
    `export { BrowserModule } from "@angular/platform-browser";`,
    // Not reported: non-reference identifiers like object keys
    `import { BrowserModule } from "@angular/platform-browser"; const a = { BrowserModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

const a = BrowserModule;
const b = [BrowserModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { BrowserModule } from "@angular/platform-browser"; BrowserModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { BrowserModule } from "@angular/platform-browser"; let a: BrowserModule;`,
      errors: [error],
    },
    {
      code: `import { BrowserModule } from "@angular/platform-browser"; type T = typeof BrowserModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

function f() {
  return () => ({ imports: [[BrowserModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { BrowserModule } from "@angular/platform-browser";

export { BrowserModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserModule } from "@angular/platform-browser"; const a = { BrowserModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserModule } from "@angular/platform-browser"; const { BrowserModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { BrowserModule as Alias } from "@angular/platform-browser";

@NgModule({
  imports: [Alias],
  bootstrap: [AppComponent],
})
export class AppModule {}`, errors: [error] },
  ],
});
