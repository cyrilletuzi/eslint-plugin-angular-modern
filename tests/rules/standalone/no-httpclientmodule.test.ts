import * as rule from "../../../src/rules/standalone/no-httpclientmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { HttpClientModule } from "@angular/common/http";`,
    `import { Other, HttpClientModule } from "@angular/common/http";`,
    // Type-only imports are still ImportSpecifier
    `import type { HttpClientModule } from "@angular/common/http";`,
    `import { type HttpClientModule } from "@angular/common/http";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { HttpClientModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { HttpClientModule as Alias } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias)],
});`,
    // Look-alike names (exact name match only)
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(MyHttpClientModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModules)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModuleRef)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(httpClientModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClient)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientJsonpModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientXsrfModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientTestingModule)],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(provideHttpClient)],
});`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "HttpClientModule";`,
    `// HttpClientModule`,
    `const value = ng["HttpClientModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { HttpClientModule } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
});`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { HttpClientModule } from "@angular/common/http";

const a = HttpClientModule;
const b = [HttpClientModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/common/http";

const a = ng.HttpClientModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.HttpClientModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `HttpClientModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: HttpClientModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof HttpClientModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[HttpClientModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class HttpClientModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is HttpClientModule: the specifier is not reported, but usages are
    {
      code: `import { Other as HttpClientModule } from "other-lib";

const a = HttpClientModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import HttpClientModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import * as HttpClientModule from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `import HttpClientModule = require("@angular/common/http");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { HttpClientModule as Alias } from "@angular/common/http";`,
      errors: [error],
    },
    {
      code: `export * as HttpClientModule from "@angular/common/http";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { HttpClientModule } from "@angular/common/http";`,
      errors: [error, error],
    },
    {
      code: `import { HttpClientModule } from "@angular/common/http";

export { HttpClientModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { HttpClientModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { HttpClientModule };`,
      errors: [error, error],
    },
    {
      code: `const { HttpClientModule } = a;`,
      errors: [error, error],
    },
  ],
});
