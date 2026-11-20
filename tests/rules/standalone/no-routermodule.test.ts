import * as rule from "../../../src/rules/standalone/no-routermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noRoutermodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { RouterModule } from "@angular/router";`,
    `import { Other, RouterModule } from "@angular/router";`,
    // Type-only imports are still ImportSpecifier
    `import type { RouterModule } from "@angular/router";`,
    `import { type RouterModule } from "@angular/router";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { RouterModule as Alias } from "@angular/router";`,
    `import { Other as RouterModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { RouterModule as Alias } from "@angular/router";

@NgModule({
  imports: [Alias.forRoot(routes)],
})
export class AppRoutingModule {}`,
    // Look-alike names (exact name match only)
    `@NgModule({
  imports: [MyRouterModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [RouterModules.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [RouterModuleRef.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [routerModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [RouterTestingModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [RouterOutlet.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [RouterLink.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [provideRouter.forRoot(routes)],
})
export class AppRoutingModule {}`,
    `@NgModule({
  imports: [AppRoutingModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "RouterModule";`,
    `// RouterModule`,
    `const value = ng["RouterModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { RouterModule } from "@angular/router";

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { RouterModule } from "@angular/router";

const a = RouterModule;
const b = [RouterModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/router";

const a = ng.RouterModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.RouterModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `RouterModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: RouterModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof RouterModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[RouterModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class RouterModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is RouterModule: the specifier is not reported, but usages are
    {
      code: `import { Other as RouterModule } from "other-lib";

const a = RouterModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import RouterModule from "@angular/router";`,
      errors: [error],
    },
    {
      code: `import * as RouterModule from "@angular/router";`,
      errors: [error],
    },
    {
      code: `import RouterModule = require("@angular/router");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { RouterModule as Alias } from "@angular/router";`,
      errors: [error],
    },
    {
      code: `export * as RouterModule from "@angular/router";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { RouterModule } from "@angular/router";`,
      errors: [error, error],
    },
    {
      code: `import { RouterModule } from "@angular/router";

export { RouterModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { RouterModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { RouterModule };`,
      errors: [error, error],
    },
    {
      code: `const { RouterModule } = a;`,
      errors: [error, error],
    },
  ],
});
