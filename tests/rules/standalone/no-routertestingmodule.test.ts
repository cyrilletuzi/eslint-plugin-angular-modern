import * as rule from "../../../src/rules/standalone/no-routertestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noRoutertestingmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { RouterTestingModule } from "@angular/router/testing";`,
    `import { Other, RouterTestingModule } from "@angular/router/testing";`,
    // Type-only imports alone are not reported either
    `import type { RouterTestingModule } from "@angular/router/testing";`,
    `import { type RouterTestingModule } from "@angular/router/testing";`,
    // Aliased imports alone are not reported either
    `import { RouterTestingModule as Alias } from "@angular/router/testing";`,
    `import { Other as RouterTestingModule } from "other-lib";`,
    // Look-alike names are not reported
    `TestBed.configureTestingModule({
  imports: [
    MyRouterTestingModule,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    RouterTestingModules,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    RouterTestingModuleRef,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    routerTestingModule,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    RouterModule,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    RouterTestingHarness,
  ],
});`,
    `TestBed.configureTestingModule({
  imports: [
    provideRouter,
  ],
});`,
    // Not a usage: strings, comments, computed access with a string
    `import { RouterTestingModule } from "@angular/router/testing"; const name = "RouterTestingModule";`,
    `import { RouterTestingModule } from "@angular/router/testing"; // RouterTestingModule`,
    `import { RouterTestingModule } from "@angular/router/testing"; const value = ng["RouterTestingModule"];`,
    // Usage without import is not reported
    `TestBed.configureTestingModule({
  imports: [
    RouterTestingModule,
  ],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/router/testing";

const a = ng.RouterTestingModule;`,
    `import { RouterTestingModule } from "@angular/router/testing"; const a = foo.bar.RouterTestingModule;`,
    // Not reported: local declaration with the same name
    `class RouterTestingModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as RouterTestingModule } from "other-lib";

const a = RouterTestingModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import RouterTestingModule from "@angular/router/testing";`,
    `import * as RouterTestingModule from "@angular/router/testing";`,
    `import { RouterTestingModule } from "@angular/router/testing"; import RouterTestingModule = require("@angular/router/testing");`,
    // Not reported: re-exports without import (not a usage)
    `export { RouterTestingModule as Alias } from "@angular/router/testing";`,
    `export * as RouterTestingModule from "@angular/router/testing";`,
    // Not reported: re-export without import (not a usage)
    `export { RouterTestingModule } from "@angular/router/testing";`,
    // Not reported: non-reference identifiers like object keys
    `import { RouterTestingModule } from "@angular/router/testing"; const a = { RouterTestingModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { RouterTestingModule } from "@angular/router/testing";

TestBed.configureTestingModule({
  imports: [
    RouterTestingModule,
  ],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { RouterTestingModule } from "@angular/router/testing";

const a = RouterTestingModule;
const b = [RouterTestingModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { RouterTestingModule } from "@angular/router/testing"; RouterTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { RouterTestingModule } from "@angular/router/testing"; let a: RouterTestingModule;`,
      errors: [error],
    },
    {
      code: `import { RouterTestingModule } from "@angular/router/testing"; type T = typeof RouterTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { RouterTestingModule } from "@angular/router/testing";

function f() {
  return () => ({ imports: [[RouterTestingModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { RouterTestingModule } from "@angular/router/testing";

export { RouterTestingModule };`,
      errors: [error],
    },
    {
      code: `import { RouterTestingModule } from "@angular/router/testing"; const a = { RouterTestingModule };`,
      errors: [error],
    },
    {
      code: `import { RouterTestingModule } from "@angular/router/testing"; const { RouterTestingModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { RouterTestingModule as Alias } from "@angular/router/testing";

TestBed.configureTestingModule({
  imports: [
    Alias,
  ],
});`, errors: [error] },
  ],
});
