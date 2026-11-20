import * as rule from "../../../src/rules/standalone/no-routermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noRoutermodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { RouterModule } from "@angular/router";`,
    `import { Other, RouterModule } from "@angular/router";`,
    // Type-only imports alone are not reported either
    `import type { RouterModule } from "@angular/router";`,
    `import { type RouterModule } from "@angular/router";`,
    // Aliased imports alone are not reported either
    `import { RouterModule as Alias } from "@angular/router";`,
    `import { Other as RouterModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { RouterModule } from "@angular/router"; const name = "RouterModule";`,
    `import { RouterModule } from "@angular/router"; // RouterModule`,
    `import { RouterModule } from "@angular/router"; const value = ng["RouterModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/router";

const a = ng.RouterModule;`,
    `import { RouterModule } from "@angular/router"; const a = foo.bar.RouterModule;`,
    // Not reported: local declaration with the same name
    `class RouterModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as RouterModule } from "other-lib";

const a = RouterModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import RouterModule from "@angular/router";`,
    `import * as RouterModule from "@angular/router";`,
    `import { RouterModule } from "@angular/router"; import RouterModule = require("@angular/router");`,
    // Not reported: re-exports without import (not a usage)
    `export { RouterModule as Alias } from "@angular/router";`,
    `export * as RouterModule from "@angular/router";`,
    // Not reported: re-export without import (not a usage)
    `export { RouterModule } from "@angular/router";`,
    // Not reported: non-reference identifiers like object keys
    `import { RouterModule } from "@angular/router"; const a = { RouterModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { RouterModule } from "@angular/router";

const a = RouterModule;
const b = [RouterModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { RouterModule } from "@angular/router"; RouterModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { RouterModule } from "@angular/router"; let a: RouterModule;`,
      errors: [error],
    },
    {
      code: `import { RouterModule } from "@angular/router"; type T = typeof RouterModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { RouterModule } from "@angular/router";

function f() {
  return () => ({ imports: [[RouterModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { RouterModule } from "@angular/router";

export { RouterModule };`,
      errors: [error],
    },
    {
      code: `import { RouterModule } from "@angular/router"; const a = { RouterModule };`,
      errors: [error],
    },
    {
      code: `import { RouterModule } from "@angular/router"; const { RouterModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { RouterModule as Alias } from "@angular/router";

@NgModule({
  imports: [Alias.forRoot(routes)],
})
export class AppRoutingModule {}`, errors: [error] },
  ],
});
