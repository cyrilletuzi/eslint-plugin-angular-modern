import * as rule from "../../../src/rules/standalone/no-browsertestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noBrowsertestingmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { BrowserTestingModule } from "@angular/platform-browser/testing";`,
    `import { Other, BrowserTestingModule } from "@angular/platform-browser/testing";`,
    // Type-only imports alone are not reported either
    `import type { BrowserTestingModule } from "@angular/platform-browser/testing";`,
    `import { type BrowserTestingModule } from "@angular/platform-browser/testing";`,
    // Aliased imports alone are not reported either
    `import { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";`,
    `import { Other as BrowserTestingModule } from "other-lib";`,
    // Look-alike names are not reported
    `getTestBed().initTestEnvironment(MyBrowserTestingModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserTestingModules, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserTestingModuleRef, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(browserTestingModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(BrowserModule, platformBrowserTesting());`,
    `getTestBed().initTestEnvironment(platformBrowserTesting, platformBrowserTesting());`,
    // Not a usage: strings, comments, computed access with a string
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const name = "BrowserTestingModule";`,
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; // BrowserTestingModule`,
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const value = ng["BrowserTestingModule"];`,
    // SUSPECTED BUG: `BrowserDynamicTestingModule` (the classic module from `@angular/platform-browser-dynamic/testing`) is not covered by this rule (exact name match)
    `import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());`,
    // Usage without import is not reported
    `getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/platform-browser/testing";

const a = ng.BrowserTestingModule;`,
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const a = foo.bar.BrowserTestingModule;`,
    // Not reported: local declaration with the same name
    `class BrowserTestingModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as BrowserTestingModule } from "other-lib";

const a = BrowserTestingModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import BrowserTestingModule from "@angular/platform-browser/testing";`,
    `import * as BrowserTestingModule from "@angular/platform-browser/testing";`,
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; import BrowserTestingModule = require("@angular/platform-browser/testing");`,
    // Not reported: re-exports without import (not a usage)
    `export { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";`,
    `export * as BrowserTestingModule from "@angular/platform-browser/testing";`,
    // Not reported: re-export without import (not a usage)
    `export { BrowserTestingModule } from "@angular/platform-browser/testing";`,
    // Not reported: non-reference identifiers like object keys
    `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const a = { BrowserTestingModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

getTestBed().initTestEnvironment(BrowserTestingModule, platformBrowserTesting());`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

const a = BrowserTestingModule;
const b = [BrowserTestingModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing"; BrowserTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing"; let a: BrowserTestingModule;`,
      errors: [error],
    },
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing"; type T = typeof BrowserTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

function f() {
  return () => ({ imports: [[BrowserTestingModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing";

export { BrowserTestingModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const a = { BrowserTestingModule };`,
      errors: [error],
    },
    {
      code: `import { BrowserTestingModule } from "@angular/platform-browser/testing"; const { BrowserTestingModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { BrowserTestingModule as Alias } from "@angular/platform-browser/testing";

getTestBed().initTestEnvironment(Alias, platformBrowserTesting());`, errors: [error] },
  ],
});
