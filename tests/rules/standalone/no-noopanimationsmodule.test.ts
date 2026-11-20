import * as rule from "../../../src/rules/standalone/no-noopanimationsmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNoopanimationsmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { Other, NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    // Type-only imports are still ImportSpecifier
    `import type { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    `import { type NoopAnimationsModule } from "@angular/platform-browser/animations";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
    `import { Other as NoopAnimationsModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";

TestBed.configureTestingModule({
  imports: [Alias],
});`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "NoopAnimationsModule";`,
    `// NoopAnimationsModule`,
    `const value = ng["NoopAnimationsModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `TestBed.configureTestingModule({
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/platform-browser/animations";

const a = ng.NoopAnimationsModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.NoopAnimationsModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `NoopAnimationsModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: NoopAnimationsModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof NoopAnimationsModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[NoopAnimationsModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class NoopAnimationsModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is NoopAnimationsModule: the specifier is not reported, but usages are
    {
      code: `import { Other as NoopAnimationsModule } from "other-lib";

const a = NoopAnimationsModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import NoopAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `import * as NoopAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `import NoopAnimationsModule = require("@angular/platform-browser/animations");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { NoopAnimationsModule as Alias } from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    {
      code: `export * as NoopAnimationsModule from "@angular/platform-browser/animations";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { NoopAnimationsModule } from "@angular/platform-browser/animations";`,
      errors: [error, error],
    },
    {
      code: `import { NoopAnimationsModule } from "@angular/platform-browser/animations";

export { NoopAnimationsModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { NoopAnimationsModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { NoopAnimationsModule };`,
      errors: [error, error],
    },
    {
      code: `const { NoopAnimationsModule } = a;`,
      errors: [error, error],
    },
  ],
});
