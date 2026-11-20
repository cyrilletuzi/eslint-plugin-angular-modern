import * as rule from "../../../src/rules/standalone/no-commonmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCommonmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { CommonModule } from "@angular/common";`,
    `import { Other, CommonModule } from "@angular/common";`,
    // Type-only imports are still ImportSpecifier
    `import type { CommonModule } from "@angular/common";`,
    `import { type CommonModule } from "@angular/common";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { CommonModule as Alias } from "@angular/common";`,
    `import { Other as CommonModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { CommonModule as Alias } from "@angular/common";

@Component({
  imports: [Alias],
  template: "",
})
export class SomeComponent {}`,
    // Look-alike names (exact name match only)
    `@Component({
  imports: [MyCommonModule],
  template: "",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CommonModules],
  template: "",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CommonModuleRef],
  template: "",
})
export class SomeComponent {}`,
    `@Component({
  imports: [commonModule],
  template: "",
})
export class SomeComponent {}`,
    `@Component({
  imports: [CommonEngine],
  template: "",
})
export class SomeComponent {}`,
    `@Component({
  imports: [NgIf],
  template: "",
})
export class SomeComponent {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "CommonModule";`,
    `// CommonModule`,
    `const value = ng["CommonModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { CommonModule } from "@angular/common";

@Component({
  imports: [CommonModule],
  template: "",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@Component({
  imports: [CommonModule],
  template: "",
})
export class SomeComponent {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { CommonModule } from "@angular/common";

const a = CommonModule;
const b = [CommonModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/common";

const a = ng.CommonModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.CommonModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `CommonModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: CommonModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof CommonModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[CommonModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class CommonModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is CommonModule: the specifier is not reported, but usages are
    {
      code: `import { Other as CommonModule } from "other-lib";

const a = CommonModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import CommonModule from "@angular/common";`,
      errors: [error],
    },
    {
      code: `import * as CommonModule from "@angular/common";`,
      errors: [error],
    },
    {
      code: `import CommonModule = require("@angular/common");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { CommonModule as Alias } from "@angular/common";`,
      errors: [error],
    },
    {
      code: `export * as CommonModule from "@angular/common";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { CommonModule } from "@angular/common";`,
      errors: [error, error],
    },
    {
      code: `import { CommonModule } from "@angular/common";

export { CommonModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { CommonModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { CommonModule };`,
      errors: [error, error],
    },
    {
      code: `const { CommonModule } = a;`,
      errors: [error, error],
    },
  ],
});
