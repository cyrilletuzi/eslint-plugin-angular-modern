import * as rule from "../../../src/rules/standalone/no-httpclientxsrfmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientxsrfmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { HttpClientXsrfModule } from "@angular/common/http";`,
    `import { Other, HttpClientXsrfModule } from "@angular/common/http";`,
    // Type-only imports alone are not reported either
    `import type { HttpClientXsrfModule } from "@angular/common/http";`,
    `import { type HttpClientXsrfModule } from "@angular/common/http";`,
    // Aliased imports alone are not reported either
    `import { HttpClientXsrfModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientXsrfModule } from "other-lib";`,
    // Look-alike names are not reported
    `@NgModule({
  imports: [MyHttpClientXsrfModule.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientXsrfModules.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientXsrfModuleRef.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    `@NgModule({
  imports: [httpClientXsrfModule.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    `@NgModule({
  imports: [HttpClientModule.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    `@NgModule({
  imports: [withXsrfConfiguration.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    // Not a usage: strings, comments, computed access with a string
    `import { HttpClientXsrfModule } from "@angular/common/http"; const name = "HttpClientXsrfModule";`,
    `import { HttpClientXsrfModule } from "@angular/common/http"; // HttpClientXsrfModule`,
    `import { HttpClientXsrfModule } from "@angular/common/http"; const value = ng["HttpClientXsrfModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [HttpClientXsrfModule.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/common/http";

const a = ng.HttpClientXsrfModule;`,
    `import { HttpClientXsrfModule } from "@angular/common/http"; const a = foo.bar.HttpClientXsrfModule;`,
    // Not reported: local declaration with the same name
    `class HttpClientXsrfModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as HttpClientXsrfModule } from "other-lib";

const a = HttpClientXsrfModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import HttpClientXsrfModule from "@angular/common/http";`,
    `import * as HttpClientXsrfModule from "@angular/common/http";`,
    `import { HttpClientXsrfModule } from "@angular/common/http"; import HttpClientXsrfModule = require("@angular/common/http");`,
    // Not reported: re-exports without import (not a usage)
    `export { HttpClientXsrfModule as Alias } from "@angular/common/http";`,
    `export * as HttpClientXsrfModule from "@angular/common/http";`,
    // Not reported: re-export without import (not a usage)
    `export { HttpClientXsrfModule } from "@angular/common/http";`,
    // Not reported: non-reference identifiers like object keys
    `import { HttpClientXsrfModule } from "@angular/common/http"; const a = { HttpClientXsrfModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http";

@NgModule({
  imports: [HttpClientXsrfModule.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http";

const a = HttpClientXsrfModule;
const b = [HttpClientXsrfModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http"; HttpClientXsrfModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http"; let a: HttpClientXsrfModule;`,
      errors: [error],
    },
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http"; type T = typeof HttpClientXsrfModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http";

function f() {
  return () => ({ imports: [[HttpClientXsrfModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http";

export { HttpClientXsrfModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http"; const a = { HttpClientXsrfModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http"; const { HttpClientXsrfModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { HttpClientXsrfModule as Alias } from "@angular/common/http";

@NgModule({
  imports: [Alias.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`, errors: [error] },
  ],
});
