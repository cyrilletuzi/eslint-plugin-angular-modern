import * as rule from "../../../src/rules/standalone/no-servermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noServermodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { ServerModule } from "@angular/platform-server";`,
    `import { Other, ServerModule } from "@angular/platform-server";`,
    // Type-only imports alone are not reported either
    `import type { ServerModule } from "@angular/platform-server";`,
    `import { type ServerModule } from "@angular/platform-server";`,
    // Aliased imports alone are not reported either
    `import { ServerModule as Alias } from "@angular/platform-server";`,
    `import { Other as ServerModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { ServerModule } from "@angular/platform-server"; const name = "ServerModule";`,
    `import { ServerModule } from "@angular/platform-server"; // ServerModule`,
    `import { ServerModule } from "@angular/platform-server"; const value = ng["ServerModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/platform-server";

const a = ng.ServerModule;`,
    `import { ServerModule } from "@angular/platform-server"; const a = foo.bar.ServerModule;`,
    // Not reported: local declaration with the same name
    `class ServerModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as ServerModule } from "other-lib";

const a = ServerModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import ServerModule from "@angular/platform-server";`,
    `import * as ServerModule from "@angular/platform-server";`,
    `import { ServerModule } from "@angular/platform-server"; import ServerModule = require("@angular/platform-server");`,
    // Not reported: re-exports without import (not a usage)
    `export { ServerModule as Alias } from "@angular/platform-server";`,
    `export * as ServerModule from "@angular/platform-server";`,
    // Not reported: re-export without import (not a usage)
    `export { ServerModule } from "@angular/platform-server";`,
    // Not reported: non-reference identifiers like object keys
    `import { ServerModule } from "@angular/platform-server"; const a = { ServerModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { ServerModule } from "@angular/platform-server";

const a = ServerModule;
const b = [ServerModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { ServerModule } from "@angular/platform-server"; ServerModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { ServerModule } from "@angular/platform-server"; let a: ServerModule;`,
      errors: [error],
    },
    {
      code: `import { ServerModule } from "@angular/platform-server"; type T = typeof ServerModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { ServerModule } from "@angular/platform-server";

function f() {
  return () => ({ imports: [[ServerModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { ServerModule } from "@angular/platform-server";

export { ServerModule };`,
      errors: [error],
    },
    {
      code: `import { ServerModule } from "@angular/platform-server"; const a = { ServerModule };`,
      errors: [error],
    },
    {
      code: `import { ServerModule } from "@angular/platform-server"; const { ServerModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { ServerModule as Alias } from "@angular/platform-server";

@NgModule({
  imports: [AppModule, Alias],
  bootstrap: [AppComponent],
})
export class AppServerModule {}`, errors: [error] },
  ],
});
