import * as rule from "../../../src/rules/standalone/no-httpclientjsonpmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientjsonpmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { HttpClientJsonpModule } from "@angular/common/http";`,
    `import { Other, HttpClientJsonpModule } from "@angular/common/http";`,
    // Type-only imports alone are not reported either
    `import type { HttpClientJsonpModule } from "@angular/common/http";`,
    `import { type HttpClientJsonpModule } from "@angular/common/http";`,
    // Aliased imports alone are not reported either
    `import { HttpClientJsonpModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientJsonpModule } from "other-lib";`,
    // Look-alike names are not reported
    `@NgModule({
  imports: [MyHttpClientJsonpModule],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientJsonpModules],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientJsonpModuleRef],
})
export class AppModule {}`,
    `@NgModule({
  imports: [httpClientJsonpModule],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientModule],
})
export class AppModule {}`,
    `@NgModule({
  imports: [withJsonpSupport],
})
export class AppModule {}`,
    // Not a usage: strings, comments, computed access with a string
    `import { HttpClientJsonpModule } from "@angular/common/http"; const name = "HttpClientJsonpModule";`,
    `import { HttpClientJsonpModule } from "@angular/common/http"; // HttpClientJsonpModule`,
    `import { HttpClientJsonpModule } from "@angular/common/http"; const value = ng["HttpClientJsonpModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [HttpClientJsonpModule],
})
export class AppModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/common/http";

const a = ng.HttpClientJsonpModule;`,
    `import { HttpClientJsonpModule } from "@angular/common/http"; const a = foo.bar.HttpClientJsonpModule;`,
    // Not reported: local declaration with the same name
    `class HttpClientJsonpModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as HttpClientJsonpModule } from "other-lib";

const a = HttpClientJsonpModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import HttpClientJsonpModule from "@angular/common/http";`,
    `import * as HttpClientJsonpModule from "@angular/common/http";`,
    `import { HttpClientJsonpModule } from "@angular/common/http"; import HttpClientJsonpModule = require("@angular/common/http");`,
    // Not reported: re-exports without import (not a usage)
    `export { HttpClientJsonpModule as Alias } from "@angular/common/http";`,
    `export * as HttpClientJsonpModule from "@angular/common/http";`,
    // Not reported: re-export without import (not a usage)
    `export { HttpClientJsonpModule } from "@angular/common/http";`,
    // Not reported: non-reference identifiers like object keys
    `import { HttpClientJsonpModule } from "@angular/common/http"; const a = { HttpClientJsonpModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http";

@NgModule({
  imports: [HttpClientJsonpModule],
})
export class AppModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http";

const a = HttpClientJsonpModule;
const b = [HttpClientJsonpModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http"; HttpClientJsonpModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http"; let a: HttpClientJsonpModule;`,
      errors: [error],
    },
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http"; type T = typeof HttpClientJsonpModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http";

function f() {
  return () => ({ imports: [[HttpClientJsonpModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http";

export { HttpClientJsonpModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http"; const a = { HttpClientJsonpModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http"; const { HttpClientJsonpModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { HttpClientJsonpModule as Alias } from "@angular/common/http";

@NgModule({
  imports: [Alias],
})
export class AppModule {}`, errors: [error] },
  ],
});
