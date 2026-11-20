import * as rule from "../../../src/rules/standalone/no-ngmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { NgModule } from "@angular/core";`,
    `import { Other, NgModule } from "@angular/core";`,
    // Type-only imports are still ImportSpecifier
    `import type { NgModule } from "@angular/core";`,
    `import { type NgModule } from "@angular/core";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { NgModule as Alias } from "@angular/core";`,
    `import { Other as NgModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { NgModule as Alias } from "@angular/core";

@Alias({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    // Look-alike names (exact name match only)
    `@MyNgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@NgModules({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@NgModuleRef({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@ngModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@NgModuleFactory({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@createNgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    `@AppModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "NgModule";`,
    `// NgModule`,
    `const value = ng["NgModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { NgModule } from "@angular/core";

@NgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { NgModule } from "@angular/core";

const a = NgModule;
const b = [NgModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/core";

const a = ng.NgModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.NgModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `NgModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: NgModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof NgModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[NgModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class NgModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is NgModule: the specifier is not reported, but usages are
    {
      code: `import { Other as NgModule } from "other-lib";

const a = NgModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import NgModule from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import * as NgModule from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import NgModule = require("@angular/core");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { NgModule as Alias } from "@angular/core";`,
      errors: [error],
    },
    {
      code: `export * as NgModule from "@angular/core";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { NgModule } from "@angular/core";`,
      errors: [error, error],
    },
    {
      code: `import { NgModule } from "@angular/core";

export { NgModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { NgModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { NgModule };`,
      errors: [error, error],
    },
    {
      code: `const { NgModule } = a;`,
      errors: [error, error],
    },
  ],
});
