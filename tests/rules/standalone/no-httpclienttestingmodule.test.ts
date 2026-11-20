import * as rule from "../../../src/rules/standalone/no-httpclienttestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpclienttestingmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { HttpClientTestingModule } from "@angular/common/http/testing";`,
    `import { Other, HttpClientTestingModule } from "@angular/common/http/testing";`,
    // Type-only imports alone are not reported either
    `import type { HttpClientTestingModule } from "@angular/common/http/testing";`,
    `import { type HttpClientTestingModule } from "@angular/common/http/testing";`,
    // Aliased imports alone are not reported either
    `import { HttpClientTestingModule as Alias } from "@angular/common/http/testing";`,
    `import { Other as HttpClientTestingModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; const name = "HttpClientTestingModule";`,
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; // HttpClientTestingModule`,
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; const value = ng["HttpClientTestingModule"];`,
    // Usage without import is not reported
    `TestBed.configureTestingModule({
  imports: [HttpClientTestingModule],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/common/http/testing";

const a = ng.HttpClientTestingModule;`,
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; const a = foo.bar.HttpClientTestingModule;`,
    // Not reported: local declaration with the same name
    `class HttpClientTestingModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as HttpClientTestingModule } from "other-lib";

const a = HttpClientTestingModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import HttpClientTestingModule from "@angular/common/http/testing";`,
    `import * as HttpClientTestingModule from "@angular/common/http/testing";`,
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; import HttpClientTestingModule = require("@angular/common/http/testing");`,
    // Not reported: re-exports without import (not a usage)
    `export { HttpClientTestingModule as Alias } from "@angular/common/http/testing";`,
    `export * as HttpClientTestingModule from "@angular/common/http/testing";`,
    // Not reported: re-export without import (not a usage)
    `export { HttpClientTestingModule } from "@angular/common/http/testing";`,
    // Not reported: non-reference identifiers like object keys
    `import { HttpClientTestingModule } from "@angular/common/http/testing"; const a = { HttpClientTestingModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

const a = HttpClientTestingModule;
const b = [HttpClientTestingModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing"; HttpClientTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing"; let a: HttpClientTestingModule;`,
      errors: [error],
    },
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing"; type T = typeof HttpClientTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

function f() {
  return () => ({ imports: [[HttpClientTestingModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing";

export { HttpClientTestingModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing"; const a = { HttpClientTestingModule };`,
      errors: [error],
    },
    {
      code: `import { HttpClientTestingModule } from "@angular/common/http/testing"; const { HttpClientTestingModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { HttpClientTestingModule as Alias } from "@angular/common/http/testing";

TestBed.configureTestingModule({
  imports: [Alias],
});`, errors: [error] },
  ],
});
