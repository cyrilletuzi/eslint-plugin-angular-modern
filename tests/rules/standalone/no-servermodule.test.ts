import * as rule from "../../../src/rules/standalone/no-servermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noServermodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { ServerModule } from "@angular/platform-server";`,
    `import { Other, ServerModule } from "@angular/platform-server";`,
    // Type-only imports are still ImportSpecifier
    `import type { ServerModule } from "@angular/platform-server";`,
    `import { type ServerModule } from "@angular/platform-server";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { ServerModule as Alias } from "@angular/platform-server";`,
    `import { Other as ServerModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { ServerModule as Alias } from "@angular/platform-server";

@NgModule({
  imports: [AppModule, Alias],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    // Look-alike names (exact name match only)
    `@NgModule({
  imports: [AppModule, MyServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    `@NgModule({
  imports: [AppModule, ServerModules],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    `@NgModule({
  imports: [AppModule, ServerModuleRef],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    `@NgModule({
  imports: [AppModule, serverModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    `@NgModule({
  imports: [AppModule, AppServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    `@NgModule({
  imports: [AppModule, provideServerRendering],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "ServerModule";`,
    `// ServerModule`,
    `const value = ng["ServerModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { ServerModule } from "@angular/platform-server";

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { ServerModule } from "@angular/platform-server";

const a = ServerModule;
const b = [ServerModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/platform-server";

const a = ng.ServerModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.ServerModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `ServerModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: ServerModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof ServerModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[ServerModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class ServerModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is ServerModule: the specifier is not reported, but usages are
    {
      code: `import { Other as ServerModule } from "other-lib";

const a = ServerModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import ServerModule from "@angular/platform-server";`,
      errors: [error],
    },
    {
      code: `import * as ServerModule from "@angular/platform-server";`,
      errors: [error],
    },
    {
      code: `import ServerModule = require("@angular/platform-server");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { ServerModule as Alias } from "@angular/platform-server";`,
      errors: [error],
    },
    {
      code: `export * as ServerModule from "@angular/platform-server";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { ServerModule } from "@angular/platform-server";`,
      errors: [error, error],
    },
    {
      code: `import { ServerModule } from "@angular/platform-server";

export { ServerModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { ServerModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { ServerModule };`,
      errors: [error, error],
    },
    {
      code: `const { ServerModule } = a;`,
      errors: [error, error],
    },
  ],
});
