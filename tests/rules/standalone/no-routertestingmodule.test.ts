import * as rule from "../../../src/rules/standalone/no-routertestingmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noRoutertestingmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { RouterTestingModule } from "@angular/router/testing";`,
    `import { Other, RouterTestingModule } from "@angular/router/testing";`,
    // Type-only imports are still ImportSpecifier
    `import type { RouterTestingModule } from "@angular/router/testing";`,
    `import { type RouterTestingModule } from "@angular/router/testing";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { RouterTestingModule as Alias } from "@angular/router/testing";`,
    `import { Other as RouterTestingModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { RouterTestingModule as Alias } from "@angular/router/testing";

TestBed.configureTestingModule({
  imports: [
    Alias,
  ],
});`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "RouterTestingModule";`,
    `// RouterTestingModule`,
    `const value = ng["RouterTestingModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `TestBed.configureTestingModule({
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/router/testing";

const a = ng.RouterTestingModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.RouterTestingModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `RouterTestingModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: RouterTestingModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof RouterTestingModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[RouterTestingModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class RouterTestingModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is RouterTestingModule: the specifier is not reported, but usages are
    {
      code: `import { Other as RouterTestingModule } from "other-lib";

const a = RouterTestingModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import RouterTestingModule from "@angular/router/testing";`,
      errors: [error],
    },
    {
      code: `import * as RouterTestingModule from "@angular/router/testing";`,
      errors: [error],
    },
    {
      code: `import RouterTestingModule = require("@angular/router/testing");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { RouterTestingModule as Alias } from "@angular/router/testing";`,
      errors: [error],
    },
    {
      code: `export * as RouterTestingModule from "@angular/router/testing";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { RouterTestingModule } from "@angular/router/testing";`,
      errors: [error, error],
    },
    {
      code: `import { RouterTestingModule } from "@angular/router/testing";

export { RouterTestingModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { RouterTestingModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { RouterTestingModule };`,
      errors: [error, error],
    },
    {
      code: `const { RouterTestingModule } = a;`,
      errors: [error, error],
    },
  ],
});
