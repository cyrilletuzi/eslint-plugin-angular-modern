import * as rule from "../../../src/rules/standalone/no-applicationmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noApplicationmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { ApplicationModule } from "@angular/core";`,
    `import { Other, ApplicationModule } from "@angular/core";`,
    // Type-only imports are still ImportSpecifier
    `import type { ApplicationModule } from "@angular/core";`,
    `import { type ApplicationModule } from "@angular/core";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { ApplicationModule as Alias } from "@angular/core";`,
    `import { Other as ApplicationModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { ApplicationModule as Alias } from "@angular/core";

@NgModule({
  imports: [Alias],
})
export class AppModule {}`,
    // Look-alike names (exact name match only)
    `@NgModule({
  imports: [MyApplicationModule],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ApplicationModules],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ApplicationModuleRef],
})
export class AppModule {}`,
    `@NgModule({
  imports: [applicationModule],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ApplicationRef],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ApplicationConfig],
})
export class AppModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "ApplicationModule";`,
    `// ApplicationModule`,
    `const value = ng["ApplicationModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { ApplicationModule } from "@angular/core";

@NgModule({
  imports: [ApplicationModule],
})
export class AppModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  imports: [ApplicationModule],
})
export class AppModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { ApplicationModule } from "@angular/core";

const a = ApplicationModule;
const b = [ApplicationModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/core";

const a = ng.ApplicationModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.ApplicationModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `ApplicationModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: ApplicationModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof ApplicationModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[ApplicationModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class ApplicationModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is ApplicationModule: the specifier is not reported, but usages are
    {
      code: `import { Other as ApplicationModule } from "other-lib";

const a = ApplicationModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import ApplicationModule from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import * as ApplicationModule from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import ApplicationModule = require("@angular/core");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { ApplicationModule as Alias } from "@angular/core";`,
      errors: [error],
    },
    {
      code: `export * as ApplicationModule from "@angular/core";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { ApplicationModule } from "@angular/core";`,
      errors: [error, error],
    },
    {
      code: `import { ApplicationModule } from "@angular/core";

export { ApplicationModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { ApplicationModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { ApplicationModule };`,
      errors: [error, error],
    },
    {
      code: `const { ApplicationModule } = a;`,
      errors: [error, error],
    },
  ],
});
