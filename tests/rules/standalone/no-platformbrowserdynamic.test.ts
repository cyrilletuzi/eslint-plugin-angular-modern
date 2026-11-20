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
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; const fn = platformBrowserDynamic;`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; register(platformBrowserDynamic);`,
    // `new` is a NewExpression, not a CallExpression
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; new platformBrowserDynamic();`,
    // Method calls on any object are not reported
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; obj.platformBrowserDynamic();`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; this.platformBrowserDynamic();`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; obj["platformBrowserDynamic"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.platformBrowserDynamic()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/platform-browser-dynamic";

ng.platformBrowserDynamic();`,
    // String / comment
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; const name = "platformBrowserDynamic()";`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; // platformBrowserDynamic()`,
    // Look-alike names are not reported
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowser();`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowserDynamicTesting();`,
    `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; bootstrapApplication();`,
    // Usage without import is not reported
    `platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));`,
    // Locally declared function with the same name is not reported
    `function platformBrowserDynamic() {}
platformBrowserDynamic();`,
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
    // Bare call, with arguments
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowserDynamic();`,
      errors: [error],
    },
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowserDynamic(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowserDynamic?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

async function f() {
  await platformBrowserDynamic();
}`,
      errors: [error],
    },
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; const f = () => ({ providers: [[platformBrowserDynamic()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic"; platformBrowserDynamic()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

platformBrowserDynamic();
platformBrowserDynamic();`,
      errors: [error, error],
    },
    // Aliased import is reported
    { code: `import { platformBrowserDynamic as alias } from "@angular/platform-browser-dynamic";

alias()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));`, errors: [error] },
  ],
});
