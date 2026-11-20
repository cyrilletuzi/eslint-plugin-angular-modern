import * as rule from "../../../src/rules/zoneless/no-providezonechangedetection.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noProvidezonechangedetection" };

testRule(rule, {
  valid: [
    // Import alone is not a call
    `import { provideZoneChangeDetection } from "@angular/core";`,
    // Function declaration with the same name is not a call
    `function provideZoneChangeDetection() {}`,
    // Reference without call (callback, assignment)
    `const fn = provideZoneChangeDetection;`,
    `register(provideZoneChangeDetection);`,
    // `new` is a NewExpression, not a CallExpression
    `new provideZoneChangeDetection();`,
    // Callee is not an Identifier: method calls on any object
    `obj.provideZoneChangeDetection();`,
    `this.provideZoneChangeDetection();`,
    `obj["provideZoneChangeDetection"]();`,
    // SUSPECTED BUG: namespace import usage `ng.provideZoneChangeDetection()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core";

ng.provideZoneChangeDetection();`,
    // SUSPECTED BUG: aliases are not followed, so a call to an aliased import is not reported (false negative)
    `import { provideZoneChangeDetection as alias } from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [alias({ eventCoalescing: true })],
});`,
    // String / comment
    `const name = "provideZoneChangeDetection()";`,
    `// provideZoneChangeDetection()`,
    // Look-alike names (exact name match only)
    `provideZonelessChangeDetection();`,
    `provideExperimentalZonelessChangeDetection();`,
    `provideZoneChangeDetections();`,
    `NgZone();`,
  ],
  invalid: [
    // Realistic usage with import: only the call is reported
    {
      code: `import { provideZoneChangeDetection } from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
});`,
      errors: [error],
    },
    // Usage without import (name-based)
    {
      code: `bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
});`,
      errors: [error],
    },
    // Bare call, with arguments
    {
      code: `provideZoneChangeDetection();`,
      errors: [error],
    },
    {
      code: `provideZoneChangeDetection(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `provideZoneChangeDetection?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `async function f() {
  await provideZoneChangeDetection();
}`,
      errors: [error],
    },
    {
      code: `const f = () => ({ providers: [[provideZoneChangeDetection()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call has an Identifier callee
    {
      code: `provideZoneChangeDetection()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `provideZoneChangeDetection();
provideZoneChangeDetection();`,
      errors: [error, error],
    },
    // Locally declared function with the same name (no import source check)
    {
      code: `function provideZoneChangeDetection() {}
provideZoneChangeDetection();`,
      errors: [error],
    },
    // Also in TestBed providers
    {
      code: `TestBed.configureTestingModule({
  providers: [provideZoneChangeDetection()],
});`,
      errors: [error],
    },
  ],
});
