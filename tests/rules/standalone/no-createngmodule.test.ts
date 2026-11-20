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
    `import { createNgModule } from "@angular/core"; const fn = createNgModule;`,
    `import { createNgModule } from "@angular/core"; register(createNgModule);`,
    // `new` is a NewExpression, not a CallExpression
    `import { createNgModule } from "@angular/core"; new createNgModule();`,
    // Method calls on any object are not reported
    `import { createNgModule } from "@angular/core"; obj.createNgModule();`,
    `import { createNgModule } from "@angular/core"; this.createNgModule();`,
    `import { createNgModule } from "@angular/core"; obj["createNgModule"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.createNgModule()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core";

ng.createNgModule();`,
    // String / comment
    `import { createNgModule } from "@angular/core"; const name = "createNgModule()";`,
    `import { createNgModule } from "@angular/core"; // createNgModule()`,
    // Look-alike names are not reported
    `import { createNgModule } from "@angular/core"; createNgModules();`,
    `import { createNgModule } from "@angular/core"; createComponent();`,
    `import { createNgModule } from "@angular/core"; createEnvironmentInjector();`,
    `import { createNgModule } from "@angular/core"; NgModule();`,
    // Usage without import is not reported
    `const moduleRef = createNgModule(SomeModule, this.injector);`,
    // Locally declared function with the same name is not reported
    `function createNgModule() {}
createNgModule();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { createNgModule } from "@angular/core";

const moduleRef = createNgModule(SomeModule, this.injector);`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `import { createNgModule } from "@angular/core"; createNgModule();`,
      errors: [error],
    },
    {
      code: `import { createNgModule } from "@angular/core"; createNgModule(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `import { createNgModule } from "@angular/core"; createNgModule?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `import { createNgModule } from "@angular/core";

async function f() {
  await createNgModule();
}`,
      errors: [error],
    },
    {
      code: `import { createNgModule } from "@angular/core"; const f = () => ({ providers: [[createNgModule()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported
    {
      code: `import { createNgModule } from "@angular/core"; createNgModule()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `import { createNgModule } from "@angular/core";

createNgModule();
createNgModule();`,
      errors: [error, error],
    },
    // Aliased import is reported
    { code: `import { createNgModule as alias } from "@angular/core";

const moduleRef = alias(SomeModule, this.injector);`, errors: [error] },
  ],
});
