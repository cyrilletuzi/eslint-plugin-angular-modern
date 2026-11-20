import * as rule from "../../../src/rules/standalone/no-serviceworkermodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noServiceworkermodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { ServiceWorkerModule } from "@angular/service-worker";`,
    `import { Other, ServiceWorkerModule } from "@angular/service-worker";`,
    // Type-only imports alone are not reported either
    `import type { ServiceWorkerModule } from "@angular/service-worker";`,
    `import { type ServiceWorkerModule } from "@angular/service-worker";`,
    // Aliased imports alone are not reported either
    `import { ServiceWorkerModule as Alias } from "@angular/service-worker";`,
    `import { Other as ServiceWorkerModule } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { ServiceWorkerModule } from "@angular/service-worker"; const name = "ServiceWorkerModule";`,
    `import { ServiceWorkerModule } from "@angular/service-worker"; // ServiceWorkerModule`,
    `import { ServiceWorkerModule } from "@angular/service-worker"; const value = ng["ServiceWorkerModule"];`,
    // Usage without import is not reported
    `@NgModule({
  imports: [ServiceWorkerModule.register("ngsw-worker.js")],
})
export class AppModule {}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/service-worker";

const a = ng.ServiceWorkerModule;`,
    `import { ServiceWorkerModule } from "@angular/service-worker"; const a = foo.bar.ServiceWorkerModule;`,
    // Not reported: local declaration with the same name
    `class ServiceWorkerModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as ServiceWorkerModule } from "other-lib";

const a = ServiceWorkerModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import ServiceWorkerModule from "@angular/service-worker";`,
    `import * as ServiceWorkerModule from "@angular/service-worker";`,
    `import { ServiceWorkerModule } from "@angular/service-worker"; import ServiceWorkerModule = require("@angular/service-worker");`,
    // Not reported: re-exports without import (not a usage)
    `export { ServiceWorkerModule as Alias } from "@angular/service-worker";`,
    `export * as ServiceWorkerModule from "@angular/service-worker";`,
    // Not reported: re-export without import (not a usage)
    `export { ServiceWorkerModule } from "@angular/service-worker";`,
    // Not reported: non-reference identifiers like object keys
    `import { ServiceWorkerModule } from "@angular/service-worker"; const a = { ServiceWorkerModule: true };`,
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
    // Each occurrence is reported
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

const a = ServiceWorkerModule;
const b = [ServiceWorkerModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker"; ServiceWorkerModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker"; let a: ServiceWorkerModule;`,
      errors: [error],
    },
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker"; type T = typeof ServiceWorkerModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

function f() {
  return () => ({ imports: [[ServiceWorkerModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker";

export { ServiceWorkerModule };`,
      errors: [error],
    },
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker"; const a = { ServiceWorkerModule };`,
      errors: [error],
    },
    {
      code: `import { ServiceWorkerModule } from "@angular/service-worker"; const { ServiceWorkerModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { ServiceWorkerModule as Alias } from "@angular/service-worker";

@NgModule({
  imports: [Alias.register("ngsw-worker.js")],
})
export class AppModule {}`, errors: [error] },
  ],
});
