import * as rule from "../../../src/rules/standalone/no-ionicmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noIonicmodule" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { IonicModule } from "@ionic/angular";`,
    `import { Other, IonicModule } from "@ionic/angular";`,
    // Type-only imports are still ImportSpecifier
    `import type { IonicModule } from "@ionic/angular";`,
    `import { type IonicModule } from "@ionic/angular";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { IonicModule as Alias } from "@ionic/angular";`,
    `import { Other as IonicModule } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { IonicModule as Alias } from "@ionic/angular";

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(Alias.forRoot())],
});`,
    // Look-alike names (exact name match only)
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
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "IonicModule";`,
    `// IonicModule`,
    `const value = ng["IonicModule"];`,
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
    // Usage without import (name-based, no import source check)
    {
      code: `bootstrapApplication(AppComponent, {
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
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@ionic/angular";

const a = ng.IonicModule;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.IonicModule;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `IonicModule.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: IonicModule;`,
      errors: [error],
    },
    {
      code: `type T = typeof IonicModule;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[IonicModule]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class IonicModule {}`,
      errors: [error],
    },
    // An aliased import whose local name is IonicModule: the specifier is not reported, but usages are
    {
      code: `import { Other as IonicModule } from "other-lib";

const a = IonicModule;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import IonicModule from "@ionic/angular";`,
      errors: [error],
    },
    {
      code: `import * as IonicModule from "@ionic/angular";`,
      errors: [error],
    },
    {
      code: `import IonicModule = require("@ionic/angular");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { IonicModule as Alias } from "@ionic/angular";`,
      errors: [error],
    },
    {
      code: `export * as IonicModule from "@ionic/angular";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { IonicModule } from "@ionic/angular";`,
      errors: [error, error],
    },
    {
      code: `import { IonicModule } from "@ionic/angular";

export { IonicModule };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { IonicModule: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { IonicModule };`,
      errors: [error, error],
    },
    {
      code: `const { IonicModule } = a;`,
      errors: [error, error],
    },
  ],
});
