import * as rule from "../../../src/rules/standalone/no-ionicmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noIonicmodule" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { IonicModule } from "@ionic/angular";`,
    `import { Other, IonicModule } from "@ionic/angular";`,
    // Type-only imports alone are not reported either
    `import type { IonicModule } from "@ionic/angular";`,
    `import { type IonicModule } from "@ionic/angular";`,
    // Aliased imports alone are not reported either
    `import { IonicModule as Alias } from "@ionic/angular";`,
    `import { Other as IonicModule } from "other-lib";`,
    // Look-alike names are not reported
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(MyIonicModule.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicModules.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicModuleRef.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(ionicModule.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicRouteStrategy.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicStorageModule.forRoot())],
});`,
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(provideIonicAngular.forRoot())],
});`,
    // Not a usage: strings, comments, computed access with a string
    `import { IonicModule } from "@ionic/angular"; const name = "IonicModule";`,
    `import { IonicModule } from "@ionic/angular"; // IonicModule`,
    `import { IonicModule } from "@ionic/angular"; const value = ng["IonicModule"];`,
    // Usage without import is not reported
    `bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicModule.forRoot())],
});`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@ionic/angular";

const a = ng.IonicModule;`,
    `import { IonicModule } from "@ionic/angular"; const a = foo.bar.IonicModule;`,
    // Not reported: local declaration with the same name
    `class IonicModule {}`,
    // Not reported: same local name imported from another library
    `import { Other as IonicModule } from "other-lib";

const a = IonicModule;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import IonicModule from "@ionic/angular";`,
    `import * as IonicModule from "@ionic/angular";`,
    `import { IonicModule } from "@ionic/angular"; import IonicModule = require("@ionic/angular");`,
    // Not reported: re-exports without import (not a usage)
    `export { IonicModule as Alias } from "@ionic/angular";`,
    `export * as IonicModule from "@ionic/angular";`,
    // Not reported: re-export without import (not a usage)
    `export { IonicModule } from "@ionic/angular";`,
    // Not reported: non-reference identifiers like object keys
    `import { IonicModule } from "@ionic/angular"; const a = { IonicModule: true };`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { IonicModule } from "@ionic/angular";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(IonicModule.forRoot())],
});`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { IonicModule } from "@ionic/angular";

const a = IonicModule;
const b = [IonicModule];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { IonicModule } from "@ionic/angular"; IonicModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { IonicModule } from "@ionic/angular"; let a: IonicModule;`,
      errors: [error],
    },
    {
      code: `import { IonicModule } from "@ionic/angular"; type T = typeof IonicModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { IonicModule } from "@ionic/angular";

function f() {
  return () => ({ imports: [[IonicModule]] });
}`,
      errors: [error],
    },
    {
      code: `import { IonicModule } from "@ionic/angular";

export { IonicModule };`,
      errors: [error],
    },
    {
      code: `import { IonicModule } from "@ionic/angular"; const a = { IonicModule };`,
      errors: [error],
    },
    {
      code: `import { IonicModule } from "@ionic/angular"; const { IonicModule } = a;`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { IonicModule as Alias } from "@ionic/angular";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias.forRoot())],
});`, errors: [error] },
  ],
});
