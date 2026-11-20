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
    `const fn = withModule;`,
    `register(withModule);`,
    // `new` is a NewExpression, not a CallExpression
    `new withModule();`,
    // Callee is not an Identifier: method calls on any object
    `obj.withModule();`,
    `this.withModule();`,
    `obj["withModule"]();`,
    // SUSPECTED BUG: namespace import usage `ng.withModule()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core/testing";

ng.withModule();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { withModule as alias } from "@angular/core/testing";

it("should...", alias({ imports: [SomeModule] }, () => {}));`,
    // String / comment
    `const name = "withModule()";`,
    `// withModule()`,
    // Look-alike names (exact name match only)
    `withModules();`,
    `withComponent();`,
    `withInterceptors();`,
    `inject();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { withModule } from "@angular/core/testing";

it("should...", withModule({ imports: [SomeModule] }, () => {}));`,
      errors: [error],
    },
    // Usage without import (name-based)
    {
      code: `it("should...", withModule({ imports: [SomeModule] }, () => {}));`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `withModule();`,
      errors: [error],
    },
    {
      code: `withModule(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `withModule?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `async function f() {
  await withModule();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[withModule()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee
    {
      code: `withModule()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `withModule();
withModule();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check)
    {
      code: `function withModule() {}
withModule();`,
      errors: [error],
    },
  ],
});
