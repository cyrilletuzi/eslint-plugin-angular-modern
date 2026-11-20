import * as rule from "../../../src/rules/standalone/no-platformbrowserdynamic.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noPlatformbrowserdynamic" };

testRule(rule, {
  valid: [
    // Import alone is not a call
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";`,
    // Function declaration with the same name is not a call
    `function platformBrowserDynamic() {}`,
    // Reference without call (callback, assignment)
    `const fn = platformBrowserDynamic;`,
    `register(platformBrowserDynamic);`,
    // `new` is a NewExpression, not a CallExpression
    `new platformBrowserDynamic();`,
    // Callee is not an Identifier: method calls on any object
    `obj.platformBrowserDynamic();`,
    `this.platformBrowserDynamic();`,
    `obj["platformBrowserDynamic"]();`,
    // SUSPECTED BUG: namespace import usage `ng.platformBrowserDynamic()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/platform-browser-dynamic";

ng.platformBrowserDynamic();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { platformBrowserDynamic as alias } from "@angular/platform-browser-dynamic";

alias()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));`,
    // String / comment
    `const name = "platformBrowserDynamic()";`,
    `// platformBrowserDynamic()`,
    // Look-alike names (exact name match only)
    `platformBrowser();`,
    `platformBrowserDynamicTesting();`,
    `bootstrapApplication();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));`,
      errors: [error],
    },
    // Usage without import (name-based)
    {
      code: `platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `platformBrowserDynamic();`,
      errors: [error],
    },
    {
      code: `platformBrowserDynamic(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `platformBrowserDynamic?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `async function f() {
  await platformBrowserDynamic();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[platformBrowserDynamic()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee
    {
      code: `platformBrowserDynamic()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `platformBrowserDynamic();
platformBrowserDynamic();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check)
    {
      code: `function platformBrowserDynamic() {}
platformBrowserDynamic();`,
      errors: [error],
    },
  ],
});
