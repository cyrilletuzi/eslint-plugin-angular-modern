import * as rule from "../../../src/rules/standalone/no-noopanimationsmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNoopanimationsmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { Other, NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    // Type-only imports alone are not reported either
    `import type { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { type NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    // Aliased imports alone are not reported either
    `import { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `import { Other as NoopAnimationsModule } from "other-lib";`,
    // Look-alike names are not reported
    `TestBed.configureTestingModule({
  imports: [MyNoopAnimationsModule],
});`,
    `TestBed.configureTestingModule({
  imports: [NoopAnimationsModules],
});`,
    `TestBed.configureTestingModule({
  imports: [NoopAnimationsModuleRef],
});`,
    `TestBed.configureTestingModule({
  imports: [noopAnimationsModule],
});`,
    `TestBed.configureTestingModule({
  imports: [BrowserAnimationsModule],
});`,
    `TestBed.configureTestingModule({
  imports: [provideNoopAnimations],
});`,
    // Not a usage: strings, comments, computed access with a string
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const name = "NoopAnimationsModule";`,
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; // NoopAnimationsModule`,
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const value = ng["NoopAnimationsModule"];`,
    // Usage without import is not reported
    `TestBed.configureTestingModule({
  imports: [NoopAnimationsModule],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/platform-browser/animations";

const a = ng.NoopAnimationsModule;`,
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const a = foo.bar.NoopAnimationsModule;`,
    // Not reported: local declaration with the same name
    `class NoopAnimationsModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as NoopAnimationsModule } from "other-lib";

const a = NoopAnimationsModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import NoopAnimationsModule from "@angular/platform-browser/animations";`,
    `import * as NoopAnimationsModule from "@angular/platform-browser/animations";`,
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; import NoopAnimationsModule = require("@angular/platform-browser/animations");`,
    // Not reported: re-exports without import (not a usage)
    `export { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `export * as NoopAnimationsModule from "@angular/platform-browser/animations";`,
    // Not reported: re-export without import (not a usage)
    `export { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    // Not reported: non-reference identifiers like object keys
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const a = { NoopAnimationsModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations";

TestBed.configureTestingModule({
  imports: [NoopAnimationsModule],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations";

const a = NoopAnimationsModule;
const b = [NoopAnimationsModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; NoopAnimationsModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; let a: NoopAnimationsModule;`,
      errors: [error],
    },
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; type T = typeof NoopAnimationsModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations";

function f() {
  return () => ({ imports: [[NoopAnimationsModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations";

export { NoopAnimationsModule };`,
      errors: [error],
    },
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const a = { NoopAnimationsModule };`,
      errors: [error],
    },
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations"; const { NoopAnimationsModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";

TestBed.configureTestingModule({
  imports: [Alias],
});`, errors: [error] },
  ],
});
