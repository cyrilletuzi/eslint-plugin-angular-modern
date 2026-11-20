import * as rule from "../../../src/rules/standalone/no-withmodule-testing.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithmoduleTesting" };

testRule(rule, {
  valid: [
    // Import alone is not a call
    `import { withModule } from "@angular/core/testing";`,
    // Function declaration with the same name is not a call
    `function withModule() {}`,
    // Reference without call (callback, assignment)
    `import { withModule } from "@angular/core/testing"; const fn = withModule;`,
    `import { withModule } from "@angular/core/testing"; register(withModule);`,
    // `new` is a NewExpression, not a CallExpression
    `import { withModule } from "@angular/core/testing"; new withModule();`,
    // Method calls on any object are not reported
    `import { withModule } from "@angular/core/testing"; obj.withModule();`,
    `import { withModule } from "@angular/core/testing"; this.withModule();`,
    `import { withModule } from "@angular/core/testing"; obj["withModule"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.withModule()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.withModule();`,
    // String / comment
    `import { withModule } from "@angular/core/testing"; const name = "withModule()";`,
    `import { withModule } from "@angular/core/testing"; // withModule()`,
    // Look-alike names are not reported
    `import { withModule } from "@angular/core/testing"; withModules();`,
    `import { withModule } from "@angular/core/testing"; withComponent();`,
    `import { withModule } from "@angular/core/testing"; withInterceptors();`,
    `import { withModule } from "@angular/core/testing"; inject();`,
    // Usage without import is not reported
    `it("should...", withModule({ imports: [SomeModule] }, () => {}));`,
    // Locally declared function with the same name is not reported
    `function withModule() {}
withModule();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { withModule } from "@angular/core/testing";

it("should...", withModule({ imports: [SomeModule] }, () => {}));`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `import { withModule } from "@angular/core/testing"; withModule();`,
      errors: [error],
    },
    {
      code: `import { withModule } from "@angular/core/testing"; withModule(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `import { withModule } from "@angular/core/testing"; withModule?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `import { withModule } from "@angular/core/testing";

async function f() {
  await withModule();
}`,
      errors: [error],
    },
    {
      code: `import { withModule } from "@angular/core/testing"; const f = () => ({ providers: [[withModule()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported
    {
      code: `import { withModule } from "@angular/core/testing"; withModule()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `import { withModule } from "@angular/core/testing";

withModule();
withModule();`,
      errors: [error, error],
    },
    // Aliased import is reported
    { code: `import { withModule as alias } from "@angular/core/testing";

it("should...", alias({ imports: [SomeModule] }, () => {}));`, errors: [error] },
  ],
});
