import * as rule from "../../../src/rules/standalone/no-httpclienttestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclienttestingmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { HttpClientTestingModule } from "@angular/common/http/testing";`,
    `import { Other, HttpClientTestingModule } from "@angular/common/http/testing";`,
    // Type-only imports are still ImportSpecifier
    `import type { HttpClientTestingModule } from "@angular/common/http/testing";`,
    `import { type HttpClientTestingModule } from "@angular/common/http/testing";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { HttpClientTestingModule as Alias } from "@angular/common/http/testing";`,
    `import { Other as HttpClientTestingModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { HttpClientTestingModule as Alias } from "@angular/common/http/testing";

TestBed.configureTestingModule({
  imports: [Alias],
});`,
    // Look-alike names (exact name match only)
    `TestBed.configureTestingModule({
  imports: [MyHttpClientTestingModule],
});`,
    `TestBed.configureTestingModule({
  imports: [HttpClientTestingModules],
});`,
    `TestBed.configureTestingModule({
  imports: [HttpClientTestingModuleRef],
});`,
    `TestBed.configureTestingModule({
  imports: [httpClientTestingModule],
});`,
    `TestBed.configureTestingModule({
  imports: [HttpClientModule],
});`,
    `TestBed.configureTestingModule({
  imports: [HttpTestingController],
});`,
    `TestBed.configureTestingModule({
  imports: [provideHttpClientTesting],
});`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "HttpClientTestingModule";`,
    `// HttpClientTestingModule`,
    `const value = ng["HttpClientTestingModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

const a = HttpClientTestingModule;
const b = [HttpClientTestingModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/common/http/testing";

const a = ng.HttpClientTestingModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.HttpClientTestingModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `HttpClientTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: HttpClientTestingModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof HttpClientTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[HttpClientTestingModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class HttpClientTestingModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is HttpClientTestingModule: the specifier is not reported, but usages are
    {
      code: `import { Other as HttpClientTestingModule } from "other-lib";

const a = HttpClientTestingModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import HttpClientTestingModule from "@angular/common/http/testing";`,
      errors: [error],
    },
    {
      code: `import * as HttpClientTestingModule from "@angular/common/http/testing";`,
      errors: [error],
    },
    {
      code: `import HttpClientTestingModule = require("@angular/common/http/testing");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { HttpClientTestingModule as Alias } from "@angular/common/http/testing";`,
      errors: [error],
    },
    {
      code: `export * as HttpClientTestingModule from "@angular/common/http/testing";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { HttpClientTestingModule } from "@angular/common/http/testing";`,
      errors: [error, error],
    },
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

export { HttpClientTestingModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { HttpClientTestingModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { HttpClientTestingModule };`,
      errors: [error, error],
    },
    {
      code: `const { HttpClientTestingModule } = a;`,
      errors: [error, error],
    },
  ],
});
