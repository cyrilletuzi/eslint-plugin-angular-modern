import * as rule from "../../../src/rules/standalone/no-httpclientjsonpmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientjsonpmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { HttpClientJsonpModule } from "@angular/common/http";`,
    `import { Other, HttpClientJsonpModule } from "@angular/common/http";`,
    // Type-only imports are still ImportSpecifier
    `import type { HttpClientJsonpModule } from "@angular/common/http";`,
    `import { type HttpClientJsonpModule } from "@angular/common/http";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { HttpClientJsonpModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientJsonpModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { HttpClientJsonpModule as Alias } from "@angular/common/http";

@NgModule({
  imports: [Alias],
})
export class AppModule {}`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "HttpClientJsonpModule";`,
    `// HttpClientJsonpModule`,
    `const value = ng["HttpClientJsonpModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/common/http";

const a = ng.HttpClientJsonpModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.HttpClientJsonpModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `HttpClientJsonpModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: HttpClientJsonpModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof HttpClientJsonpModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[HttpClientJsonpModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class HttpClientJsonpModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is HttpClientJsonpModule: the specifier is not reported, but usages are
    {
      code: `import { Other as HttpClientJsonpModule } from "other-lib";

const a = HttpClientJsonpModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import HttpClientJsonpModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import * as HttpClientJsonpModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import HttpClientJsonpModule = require("@angular/common/http");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { HttpClientJsonpModule as Alias } from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `export * as HttpClientJsonpModule from "@angular/common/http";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { HttpClientJsonpModule } from "@angular/common/http";`,
      errors: [error, error],
    },
    {
      code: `import { HttpClientJsonpModule } from "@angular/common/http";

export { HttpClientJsonpModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { HttpClientJsonpModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { HttpClientJsonpModule };`,
      errors: [error, error],
    },
    {
      code: `const { HttpClientJsonpModule } = a;`,
      errors: [error, error],
    },
  ],
});
