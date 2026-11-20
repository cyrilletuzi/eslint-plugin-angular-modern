import * as rule from "../../../src/rules/standalone/no-ngmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { NgModule } from "@angular/core";`,
    `import { Other, NgModule } from "@angular/core";`,
    // Type-only imports alone are not reported either
    `import type { NgModule } from "@angular/core";`,
    `import { type NgModule } from "@angular/core";`,
    // Aliased imports alone are not reported either
    `import { NgModule as Alias } from "@angular/core";`,
    `import { Other as NgModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { NgModule } from "@angular/core"; const name = "NgModule";`,
    `import { NgModule } from "@angular/core"; // NgModule`,
    `import { NgModule } from "@angular/core"; const value = ng["NgModule"];`,
    // Usage without import is not reported
    `@NgModule({
  declarations: [SomeComponent],
})
export class SomeModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/core";

const a = ng.NgModule;`,
    `import { NgModule } from "@angular/core"; const a = foo.bar.NgModule;`,
    // Not reported: local declaration with the same name
    `class NgModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as NgModule } from "other-lib";

const a = NgModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import NgModule from "@angular/core";`,
    `import * as NgModule from "@angular/core";`,
    `import { NgModule } from "@angular/core"; import NgModule = require("@angular/core");`,
    // Not reported: re-exports without import (not a usage)
    `export { NgModule as Alias } from "@angular/core";`,
    `export * as NgModule from "@angular/core";`,
    // Not reported: re-export without import (not a usage)
    `export { NgModule } from "@angular/core";`,
    // Not reported: non-reference identifiers like object keys
    `import { NgModule } from "@angular/core"; const a = { NgModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { NgModule } from "@angular/core";

const a = NgModule;
const b = [NgModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { NgModule } from "@angular/core"; NgModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { NgModule } from "@angular/core"; let a: NgModule;`,
      errors: [error],
    },
    {
      code: `import { NgModule } from "@angular/core"; type T = typeof NgModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { NgModule } from "@angular/core";

function f() {
  return () => ({ imports: [[NgModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { NgModule } from "@angular/core";

export { NgModule };`,
      errors: [error],
    },
    {
      code: `import { NgModule } from "@angular/core"; const a = { NgModule };`,
      errors: [error],
    },
    {
      code: `import { NgModule } from "@angular/core"; const { NgModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { NgModule as Alias } from "@angular/core";

@Alias({
  declarations: [SomeComponent],
})
export class SomeModule {}`, errors: [error] },
  ],
});
