import * as rule from "../../../src/rules/standalone/no-platformbrowser.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noPlatformbrowser" };

testRule(rule, {
  valid: [
    // Import alone is not a call
    `import { platformBrowser } from "@angular/platform-browser";`,
    // Function declaration with the same name is not a call
    `function platformBrowser() {}`,
    // Reference without call (callback, assignment)
    `const fn = platformBrowser;`,
    `register(platformBrowser);`,
    // `new` is a NewExpression, not a CallExpression
    `new platformBrowser();`,
    // Callee is not an Identifier: method calls on any object
    `obj.platformBrowser();`,
    `this.platformBrowser();`,
    `obj["platformBrowser"]();`,
    // SUSPECTED BUG: namespace import usage `ng.platformBrowser()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/platform-browser";

ng.platformBrowser();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { platformBrowser as alias } from "@angular/platform-browser";

alias().bootstrapModule(AppModule);`,
    // String / comment
    `const name = "platformBrowser()";`,
    `// platformBrowser()`,
    // Look-alike names (exact name match only)
    `platformBrowserDynamic();`,
    `platformBrowserTesting();`,
    `platformServer();`,
    `bootstrapApplication();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { platformBrowser } from "@angular/platform-browser";

platformBrowser().bootstrapModule(AppModule);`,
      errors: [error],
    },
    // Usage without import (name-based)
    {
      code: `platformBrowser().bootstrapModule(AppModule);`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `platformBrowser();`,
      errors: [error],
    },
    {
      code: `platformBrowser(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `platformBrowser?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `async function f() {
  await platformBrowser();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[platformBrowser()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee
    {
      code: `platformBrowser()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `platformBrowser();
platformBrowser();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check)
    {
      code: `function platformBrowser() {}
platformBrowser();`,
      errors: [error],
    },
  ],
});
