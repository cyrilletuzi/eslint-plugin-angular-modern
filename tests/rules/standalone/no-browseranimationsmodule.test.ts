import * as rule from "../../../src/rules/standalone/no-browseranimationsmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowseranimationsmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { Other, BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    // Type-only imports alone are not reported either
    `import type { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { type BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    // Aliased imports alone are not reported either
    `import { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `import { Other as BrowserAnimationsModule } from "other-lib";`,
    // Look-alike names are not reported
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(MyBrowserAnimationsModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModules)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModuleRef)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(browserAnimationsModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(NoopAnimationsModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(provideAnimations)],
});`,
    // Not a usage: strings, comments, computed access with a string
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const name = "BrowserAnimationsModule";`,
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; // BrowserAnimationsModule`,
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const value = ng["BrowserAnimationsModule"];`,
    // Usage without import is not reported
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModule)],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/platform-browser/animations";

const a = ng.BrowserAnimationsModule;`,
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const a = foo.bar.BrowserAnimationsModule;`,
    // Not reported: local declaration with the same name
    `class BrowserAnimationsModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as BrowserAnimationsModule } from "other-lib";

const a = BrowserAnimationsModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import BrowserAnimationsModule from "@angular/platform-browser/animations";`,
    `import * as BrowserAnimationsModule from "@angular/platform-browser/animations";`,
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; import BrowserAnimationsModule = require("@angular/platform-browser/animations");`,
    // Not reported: re-exports without import (not a usage)
    `export { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `export * as BrowserAnimationsModule from "@angular/platform-browser/animations";`,
    // Not reported: re-export without import (not a usage)
    `export { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    // Not reported: non-reference identifiers like object keys
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const a = { BrowserAnimationsModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModule)],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

const a = BrowserAnimationsModule;
const b = [BrowserAnimationsModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; BrowserAnimationsModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; let a: BrowserAnimationsModule;`,
      errors: [error],
    },
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; type T = typeof BrowserAnimationsModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

function f() {
  return () => ({ imports: [[BrowserAnimationsModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export { BrowserAnimationsModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const a = { BrowserAnimationsModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations"; const { BrowserAnimationsModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias)],
});`, errors: [error] },
  ],
});
