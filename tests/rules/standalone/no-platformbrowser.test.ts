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
    `import { platformBrowser } from "@angular/platform-browser"; const fn = platformBrowser;`,
    `import { platformBrowser } from "@angular/platform-browser"; register(platformBrowser);`,
    // `new` is a NewExpression, not a CallExpression
    `import { platformBrowser } from "@angular/platform-browser"; new platformBrowser();`,
    // Method calls on any object are not reported
    `import { platformBrowser } from "@angular/platform-browser"; obj.platformBrowser();`,
    `import { platformBrowser } from "@angular/platform-browser"; this.platformBrowser();`,
    `import { platformBrowser } from "@angular/platform-browser"; obj["platformBrowser"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.platformBrowser()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/platform-browser";

ng.platformBrowser();`,
    // String / comment
    `import { platformBrowser } from "@angular/platform-browser"; const name = "platformBrowser()";`,
    `import { platformBrowser } from "@angular/platform-browser"; // platformBrowser()`,
    // Look-alike names are not reported
    `import { platformBrowser } from "@angular/platform-browser"; platformBrowserDynamic();`,
    `import { platformBrowser } from "@angular/platform-browser"; platformBrowserTesting();`,
    `import { platformBrowser } from "@angular/platform-browser"; platformServer();`,
    `import { platformBrowser } from "@angular/platform-browser"; bootstrapApplication();`,
    // Usage without import is not reported
    `platformBrowser().bootstrapModule(AppModule);`,
    // Locally declared function with the same name is not reported
    `function platformBrowser() {}
platformBrowser();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { platformBrowser } from "@angular/platform-browser";

platformBrowser().bootstrapModule(AppModule);`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `import { platformBrowser } from "@angular/platform-browser"; platformBrowser();`,
      errors: [error],
    },
    {
      code: `import { platformBrowser } from "@angular/platform-browser"; platformBrowser(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `import { platformBrowser } from "@angular/platform-browser"; platformBrowser?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `import { platformBrowser } from "@angular/platform-browser";

async function f() {
  await platformBrowser();
}`,
      errors: [error],
    },
    {
      code: `import { platformBrowser } from "@angular/platform-browser"; const f = () => ({ providers: [[platformBrowser()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported
    {
      code: `import { platformBrowser } from "@angular/platform-browser"; platformBrowser()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `import { platformBrowser } from "@angular/platform-browser";

platformBrowser();
platformBrowser();`,
      errors: [error, error],
    },
    // Aliased import is reported
    { code: `import { platformBrowser as alias } from "@angular/platform-browser";

alias().bootstrapModule(AppModule);`, errors: [error] },
  ],
});
