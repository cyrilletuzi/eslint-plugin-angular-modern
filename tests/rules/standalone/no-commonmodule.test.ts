import * as rule from "../../../src/rules/standalone/no-commonmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCommonmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { CommonModule } from "@angular/common";`,
    `import { Other, CommonModule } from "@angular/common";`,
    // Type-only imports alone are not reported either
    `import type { CommonModule } from "@angular/common";`,
    `import { type CommonModule } from "@angular/common";`,
    // Aliased imports alone are not reported either
    `import { CommonModule as Alias } from "@angular/common";`,
    `import { Other as CommonModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { CommonModule } from "@angular/common"; const name = "CommonModule";`,
    `import { CommonModule } from "@angular/common"; // CommonModule`,
    `import { CommonModule } from "@angular/common"; const value = ng["CommonModule"];`,
    // Usage without import is not reported
    `@Component({
  imports: [CommonModule],
  template: "",
})
export class SomeComponent {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/common";

const a = ng.CommonModule;`,
    `import { CommonModule } from "@angular/common"; const a = foo.bar.CommonModule;`,
    // Not reported: local declaration with the same name
    `class CommonModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as CommonModule } from "other-lib";

const a = CommonModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import CommonModule from "@angular/common";`,
    `import * as CommonModule from "@angular/common";`,
    `import { CommonModule } from "@angular/common"; import CommonModule = require("@angular/common");`,
    // Not reported: re-exports without import (not a usage)
    `export { CommonModule as Alias } from "@angular/common";`,
    `export * as CommonModule from "@angular/common";`,
    // Not reported: re-export without import (not a usage)
    `export { CommonModule } from "@angular/common";`,
    // Not reported: non-reference identifiers like object keys
    `import { CommonModule } from "@angular/common"; const a = { CommonModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { CommonModule } from "@angular/common";

const a = CommonModule;
const b = [CommonModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { CommonModule } from "@angular/common"; CommonModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { CommonModule } from "@angular/common"; let a: CommonModule;`,
      errors: [error],
    },
    {
      code: `import { CommonModule } from "@angular/common"; type T = typeof CommonModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { CommonModule } from "@angular/common";

function f() {
  return () => ({ imports: [[CommonModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { CommonModule } from "@angular/common";

export { CommonModule };`,
      errors: [error],
    },
    {
      code: `import { CommonModule } from "@angular/common"; const a = { CommonModule };`,
      errors: [error],
    },
    {
      code: `import { CommonModule } from "@angular/common"; const { CommonModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { CommonModule as Alias } from "@angular/common";

@Component({
  imports: [Alias],
  template: "",
})
export class SomeComponent {}`, errors: [error] },
  ],
});
