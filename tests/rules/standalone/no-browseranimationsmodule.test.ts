import * as rule from "../../../src/rules/standalone/no-browseranimationsmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowseranimationsmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { Other, BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    // Type-only imports are still ImportSpecifier
    `import type { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { type BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `import { Other as BrowserAnimationsModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias)],
});`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "BrowserAnimationsModule";`,
    `// BrowserAnimationsModule`,
    `const value = ng["BrowserAnimationsModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `bootstrapApplication(AppComponent, {
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/platform-browser/animations";

const a = ng.BrowserAnimationsModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.BrowserAnimationsModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `BrowserAnimationsModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: BrowserAnimationsModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof BrowserAnimationsModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[BrowserAnimationsModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class BrowserAnimationsModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is BrowserAnimationsModule: the specifier is not reported, but usages are
    {
      code: `import { Other as BrowserAnimationsModule } from "other-lib";

const a = BrowserAnimationsModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import BrowserAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `import * as BrowserAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `import BrowserAnimationsModule = require("@angular/platform-browser/animations");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { BrowserAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `export * as BrowserAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { BrowserAnimationsModule } from "@angular/platform-browser/animations";`,
      errors: [error, error],
    },
    {
      code: `import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

export { BrowserAnimationsModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { BrowserAnimationsModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { BrowserAnimationsModule };`,
      errors: [error, error],
    },
    {
      code: `const { BrowserAnimationsModule } = a;`,
      errors: [error, error],
    },
  ],
});
