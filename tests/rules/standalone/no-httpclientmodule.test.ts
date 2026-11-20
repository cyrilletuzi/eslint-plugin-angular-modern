import * as rule from "../../../src/rules/standalone/no-httpclientmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclientmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { HttpClientModule } from "@angular/common/http";`,
    `import { Other, HttpClientModule } from "@angular/common/http";`,
    // Type-only imports alone are not reported either
    `import type { HttpClientModule } from "@angular/common/http";`,
    `import { type HttpClientModule } from "@angular/common/http";`,
    // Aliased imports alone are not reported either
    `import { HttpClientModule as Alias } from "@angular/common/http";`,
    `import { Other as HttpClientModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { HttpClientModule } from "@angular/common/http"; const name = "HttpClientModule";`,
    `import { HttpClientModule } from "@angular/common/http"; // HttpClientModule`,
    `import { HttpClientModule } from "@angular/common/http"; const value = ng["HttpClientModule"];`,
    // Usage without import is not reported
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule)],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/common/http";

const a = ng.HttpClientModule;`,
    `import { HttpClientModule } from "@angular/common/http"; const a = foo.bar.HttpClientModule;`,
    // Not reported: local declaration with the same name
    `class HttpClientModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as HttpClientModule } from "other-lib";

const a = HttpClientModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import HttpClientModule from "@angular/common/http";`,
    `import * as HttpClientModule from "@angular/common/http";`,
    `import { HttpClientModule } from "@angular/common/http"; import HttpClientModule = require("@angular/common/http");`,
    // Not reported: re-exports without import (not a usage)
    `export { HttpClientModule as Alias } from "@angular/common/http";`,
    `export * as HttpClientModule from "@angular/common/http";`,
    // Not reported: re-export without import (not a usage)
    `export { HttpClientModule } from "@angular/common/http";`,
    // Not reported: non-reference identifiers like object keys
    `import { HttpClientModule } from "@angular/common/http"; const a = { HttpClientModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { HttpClientModule } from "@angular/common/http";

const a = HttpClientModule;
const b = [HttpClientModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { HttpClientModule } from "@angular/common/http"; HttpClientModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { HttpClientModule } from "@angular/common/http"; let a: HttpClientModule;`,
      errors: [error],
    },
    {
      code: `import { HttpClientModule } from "@angular/common/http"; type T = typeof HttpClientModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { HttpClientModule } from "@angular/common/http";

function f() {
  return () => ({ imports: [[HttpClientModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { HttpClientModule } from "@angular/common/http";

export { HttpClientModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientModule } from "@angular/common/http"; const a = { HttpClientModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientModule } from "@angular/common/http"; const { HttpClientModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { HttpClientModule as Alias } from "@angular/common/http";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias)],
});`, errors: [error] },
  ],
});
