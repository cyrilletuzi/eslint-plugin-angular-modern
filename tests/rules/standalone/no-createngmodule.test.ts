import * as rule from "../../../src/rules/standalone/no-createngmodule.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noCreatengmodule" };

testRule(rule, {
  valid: [
    // Import alone is not a call
    `import { createNgModule } from "@angular/core";`,
    // Function declaration with the same name is not a call
    `function createNgModule() {}`,
    // Reference without call (callback, assignment)
    `const fn = createNgModule;`,
    `register(createNgModule);`,
    // `new` is a NewExpression, not a CallExpression
    `new createNgModule();`,
    // Callee is not an Identifier: method calls on any object
    `obj.createNgModule();`,
    `this.createNgModule();`,
    `obj["createNgModule"]();`,
    // SUSPECTED BUG: namespace import usage `ng.createNgModule()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core";

ng.createNgModule();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { createNgModule as alias } from "@angular/core";

const moduleRef = alias(SomeModule, this.injector);`,
    // String / comment
    `const name = "createNgModule()";`,
    `// createNgModule()`,
    // Look-alike names (exact name match only)
    `createNgModules();`,
    `createComponent();`,
    `createEnvironmentInjector();`,
    `NgModule();`,
    // SUSPECTED BUG: `createNgModuleRef()`, the deprecated alias of `createNgModule()`, is not reported (exact name match)
    `import { createNgModuleRef } from "@angular/core";

const moduleRef = createNgModuleRef(SomeModule, injector);`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { createNgModule } from "@angular/core";

const moduleRef = createNgModule(SomeModule, this.injector);`,
      errors: [error],
    },
    // Usage without import (name-based)
    {
      code: `const moduleRef = createNgModule(SomeModule, this.injector);`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `createNgModule();`,
      errors: [error],
    },
    {
      code: `createNgModule(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `createNgModule?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `async function f() {
  await createNgModule();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[createNgModule()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee
    {
      code: `createNgModule()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `createNgModule();
createNgModule();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check)
    {
      code: `function createNgModule() {}
createNgModule();`,
      errors: [error],
    },
  ],
});
