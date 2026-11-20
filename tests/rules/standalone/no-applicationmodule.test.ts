import * as rule from "../../../src/rules/standalone/no-applicationmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noApplicationmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { ApplicationModule } from "@angular/core";`,
    `import { Other, ApplicationModule } from "@angular/core";`,
    // Type-only imports alone are not reported either
    `import type { ApplicationModule } from "@angular/core";`,
    `import { type ApplicationModule } from "@angular/core";`,
    // Aliased imports alone are not reported either
    `import { ApplicationModule as Alias } from "@angular/core";`,
    `import { Other as ApplicationModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { ApplicationModule } from "@angular/core"; const name = "ApplicationModule";`,
    `import { ApplicationModule } from "@angular/core"; // ApplicationModule`,
    `import { ApplicationModule } from "@angular/core"; const value = ng["ApplicationModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [ApplicationModule],
})
export class AppModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/core";

const a = ng.ApplicationModule;`,
    `import { ApplicationModule } from "@angular/core"; const a = foo.bar.ApplicationModule;`,
    // Not reported: local declaration with the same name
    `class ApplicationModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as ApplicationModule } from "other-lib";

const a = ApplicationModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import ApplicationModule from "@angular/core";`,
    `import * as ApplicationModule from "@angular/core";`,
    `import { ApplicationModule } from "@angular/core"; import ApplicationModule = require("@angular/core");`,
    // Not reported: re-exports without import (not a usage)
    `export { ApplicationModule as Alias } from "@angular/core";`,
    `export * as ApplicationModule from "@angular/core";`,
    // Not reported: re-export without import (not a usage)
    `export { ApplicationModule } from "@angular/core";`,
    // Not reported: non-reference identifiers like object keys
    `import { ApplicationModule } from "@angular/core"; const a = { ApplicationModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { ApplicationModule } from "@angular/core";

const a = ApplicationModule;
const b = [ApplicationModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { ApplicationModule } from "@angular/core"; ApplicationModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { ApplicationModule } from "@angular/core"; let a: ApplicationModule;`,
      errors: [error],
    },
    {
      code: `import { ApplicationModule } from "@angular/core"; type T = typeof ApplicationModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { ApplicationModule } from "@angular/core";

function f() {
  return () => ({ imports: [[ApplicationModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { ApplicationModule } from "@angular/core";

export { ApplicationModule };`,
      errors: [error],
    },
    {
      code: `import { ApplicationModule } from "@angular/core"; const a = { ApplicationModule };`,
      errors: [error],
    },
    {
      code: `import { ApplicationModule } from "@angular/core"; const { ApplicationModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { ApplicationModule as Alias } from "@angular/core";

@NgModule({
  imports: [Alias],
})
export class AppModule {}`, errors: [error] },
  ],
});
