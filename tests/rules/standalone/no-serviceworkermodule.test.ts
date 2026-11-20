import * as rule from "../../../src/rules/standalone/no-serviceworkermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noServiceworkermodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { ServiceWorkerModule } from "@angular/service-worker";`,
    `import { Other, ServiceWorkerModule } from "@angular/service-worker";`,
    // Type-only imports are still ImportSpecifier
    `import type { ServiceWorkerModule } from "@angular/service-worker";`,
    `import { type ServiceWorkerModule } from "@angular/service-worker";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { ServiceWorkerModule as Alias } from "@angular/service-worker";`,
    `import { Other as ServiceWorkerModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { ServiceWorkerModule as Alias } from "@angular/service-worker";

@NgModule({
  imports: [Alias.register("ngsw-worker.js")],
})
export class AppModule {}`,
    // Look-alike names (exact name match only)
    `@NgModule({
  imports: [MyServiceWorkerModule.register("ngsw-worker.js")],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ServiceWorkerModules.register("ngsw-worker.js")],
})
export class AppModule {}`,
    `@NgModule({
  imports: [ServiceWorkerModuleRef.register("ngsw-worker.js")],
})
export class AppModule {}`,
    `@NgModule({
  imports: [serviceWorkerModule.register("ngsw-worker.js")],
})
export class AppModule {}`,
    `@NgModule({
  imports: [provideServiceWorker.register("ngsw-worker.js")],
})
export class AppModule {}`,
    `@NgModule({
  imports: [SwUpdate.register("ngsw-worker.js")],
})
export class AppModule {}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "ServiceWorkerModule";`,
    `// ServiceWorkerModule`,
    `const value = ng["ServiceWorkerModule"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

@NgModule({
  imports: [ServiceWorkerModule.register("ngsw-worker.js")],
})
export class AppModule {}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@NgModule({
  imports: [ServiceWorkerModule.register("ngsw-worker.js")],
})
export class AppModule {}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

const a = ServiceWorkerModule;
const b = [ServiceWorkerModule];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/service-worker";

const a = ng.ServiceWorkerModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.ServiceWorkerModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `ServiceWorkerModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: ServiceWorkerModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof ServiceWorkerModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[ServiceWorkerModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class ServiceWorkerModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is ServiceWorkerModule: the specifier is not reported, but usages are
    {
      code: `import { Other as ServiceWorkerModule } from "other-lib";

const a = ServiceWorkerModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import ServiceWorkerModule from "@angular/service-worker";`,
      errors: [error],
    },
    {
      code: `import * as ServiceWorkerModule from "@angular/service-worker";`,
      errors: [error],
    },
    {
      code: `import ServiceWorkerModule = require("@angular/service-worker");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { ServiceWorkerModule as Alias } from "@angular/service-worker";`,
      errors: [error],
    },
    {
      code: `export * as ServiceWorkerModule from "@angular/service-worker";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { ServiceWorkerModule } from "@angular/service-worker";`,
      errors: [error, error],
    },
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

export { ServiceWorkerModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { ServiceWorkerModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { ServiceWorkerModule };`,
      errors: [error, error],
    },
    {
      code: `const { ServiceWorkerModule } = a;`,
      errors: [error, error],
    },
  ],
});
