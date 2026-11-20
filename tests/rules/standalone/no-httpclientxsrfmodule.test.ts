import * as rule from "../../../src/rules/standalone/no-httpclientxsrfmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientxsrfmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { HttpClientXsrfModule } from "@angular/common/http";`,
    `import { Other, HttpClientXsrfModule } from "@angular/common/http";`,
    // Type-only imports are still ImportSpecifier
    `import type { HttpClientXsrfModule } from "@angular/common/http";`,
    `import { type HttpClientXsrfModule } from "@angular/common/http";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { HttpClientXsrfModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientXsrfModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { HttpClientXsrfModule as Alias } from "@angular/common/http";

@NgModule({
  imports: [Alias.withOptions({ cookieName: "XSRF-TOKEN" })],
})
export class AppModule {}`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "HttpClientXsrfModule";`,
    `// HttpClientXsrfModule`,
    `const value = ng["HttpClientXsrfModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/common/http";

const a = ng.HttpClientXsrfModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.HttpClientXsrfModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `HttpClientXsrfModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: HttpClientXsrfModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof HttpClientXsrfModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[HttpClientXsrfModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class HttpClientXsrfModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is HttpClientXsrfModule: the specifier is not reported, but usages are
    {
      code: `import { Other as HttpClientXsrfModule } from "other-lib";

const a = HttpClientXsrfModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import HttpClientXsrfModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import * as HttpClientXsrfModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import HttpClientXsrfModule = require("@angular/common/http");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { HttpClientXsrfModule as Alias } from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `export * as HttpClientXsrfModule from "@angular/common/http";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { HttpClientXsrfModule } from "@angular/common/http";`,
      errors: [error, error],
    },
    {
      code: `import { HttpClientXsrfModule } from "@angular/common/http";

export { HttpClientXsrfModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { HttpClientXsrfModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { HttpClientXsrfModule };`,
      errors: [error, error],
    },
    {
      code: `const { HttpClientXsrfModule } = a;`,
      errors: [error, error],
    },
  ],
});
