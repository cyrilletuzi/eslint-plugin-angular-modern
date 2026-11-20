import * as rule from "../../../src/rules/standalone/no-browsertestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowsertestingmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { BrowserTestingModule } from "@angular/platform-browser/testing";`,
    `import { Other, BrowserTestingModule } from "@angular/platform-browser/testing";`,
    // Type-only imports are still ImportSpecifier
    `import type { BrowserTestingModule } from "@angular/platform-browser/testing";`,
    `import { type BrowserTestingModule } from "@angular/platform-browser/testing";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";`,
    `import { Other as BrowserTestingModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";

getTestBed().initTestEnvironment(Alias, platformBrowserTesting());`,
    // Look-alike names (exact name match only)
    `getTestBed().initTestEnvironment(MyBrowserTestingModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserTestingModules, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserTestingModuleRef, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(browserTestingModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(platformBrowserTesting, platformBrowserTesting());`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "BrowserTestingModule";`,
    `// BrowserTestingModule`,
    `const value = ng["BrowserTestingModule"];`,
    // SUSPECTED BUG: `BrowserDynamicTestingModule` (the classic module from `@angular/platform-browser-dynamic/testing`) is not covered by this rule (exact name match)
    `import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

const a = BrowserTestingModule;
const b = [BrowserTestingModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/platform-browser/testing";

const a = ng.BrowserTestingModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.BrowserTestingModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `BrowserTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: BrowserTestingModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof BrowserTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[BrowserTestingModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class BrowserTestingModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is BrowserTestingModule: the specifier is not reported, but usages are
    {
      code: `import { Other as BrowserTestingModule } from "other-lib";

const a = BrowserTestingModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import BrowserTestingModule from "@angular/platform-browser/testing";`,
      errors: [error],
    },
    {
      code: `import * as BrowserTestingModule from "@angular/platform-browser/testing";`,
      errors: [error],
    },
    {
      code: `import BrowserTestingModule = require("@angular/platform-browser/testing");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";`,
      errors: [error],
    },
    {
      code: `export * as BrowserTestingModule from "@angular/platform-browser/testing";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { BrowserTestingModule } from "@angular/platform-browser/testing";`,
      errors: [error, error],
    },
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

export { BrowserTestingModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { BrowserTestingModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { BrowserTestingModule };`,
      errors: [error, error],
    },
    {
      code: `const { BrowserTestingModule } = a;`,
      errors: [error, error],
    },
  ],
});
