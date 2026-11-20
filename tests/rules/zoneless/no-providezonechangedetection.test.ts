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
    `import { provideZoneChangeDetection } from "@angular/core"; const fn = provideZoneChangeDetection;`,
    `import { provideZoneChangeDetection } from "@angular/core"; register(provideZoneChangeDetection);`,
    // `new` is a NewExpression, not a CallExpression
    `import { provideZoneChangeDetection } from "@angular/core"; new provideZoneChangeDetection();`,
    // Method calls on any object are not reported
    `import { provideZoneChangeDetection } from "@angular/core"; obj.provideZoneChangeDetection();`,
    `import { provideZoneChangeDetection } from "@angular/core"; this.provideZoneChangeDetection();`,
    `import { provideZoneChangeDetection } from "@angular/core"; obj["provideZoneChangeDetection"]();`,
    // ACCEPTED FALSE NEGATIVE: namespace import usage `ng.provideZoneChangeDetection()` is not reported (callee is a MemberExpression)
    `import * as ng from "@angular/core";

ng.provideZoneChangeDetection();`,
    // String / comment
    `import { provideZoneChangeDetection } from "@angular/core"; const name = "provideZoneChangeDetection()";`,
    `import { provideZoneChangeDetection } from "@angular/core"; // provideZoneChangeDetection()`,
    // Look-alike names are not reported
    `import { provideZoneChangeDetection } from "@angular/core"; provideZonelessChangeDetection();`,
    `import { provideZoneChangeDetection } from "@angular/core"; provideExperimentalZonelessChangeDetection();`,
    `import { provideZoneChangeDetection } from "@angular/core"; provideZoneChangeDetections();`,
    `import { provideZoneChangeDetection } from "@angular/core"; NgZone();`,
    // Usage without import is not reported
    `bootstrapApplication(AppComponent, {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })],
});`,
    // Locally declared function with the same name is not reported
    `function provideZoneChangeDetection() {}
provideZoneChangeDetection();`,
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
    // Bare call, with arguments
    {
      code: `import { provideZoneChangeDetection } from "@angular/core"; provideZoneChangeDetection();`,
      errors: [error],
    },
    {
      code: `import { provideZoneChangeDetection } from "@angular/core"; provideZoneChangeDetection(a, b);`,
      errors: [error],
    },
    // Optional call is still a CallExpression
    {
      code: `import { provideZoneChangeDetection } from "@angular/core"; provideZoneChangeDetection?.();`,
      errors: [error],
    },
    // Awaited / returned / nested in another call or arrow function
    {
      code: `import { provideZoneChangeDetection } from "@angular/core";

async function f() {
  await provideZoneChangeDetection();
}`,
      errors: [error],
    },
    {
      code: `import { provideZoneChangeDetection } from "@angular/core"; const f = () => ({ providers: [[provideZoneChangeDetection()]] });`,
      errors: [error],
    },
    // Call on the result: only the inner call is reported
    {
      code: `import { provideZoneChangeDetection } from "@angular/core"; provideZoneChangeDetection()();`,
      errors: [error],
    },
    // Each call is reported
    {
      code: `import { provideZoneChangeDetection } from "@angular/core";

provideZoneChangeDetection();
provideZoneChangeDetection();`,
      errors: [error, error],
    },
    // Also in TestBed providers
    {
      code: `import { provideZoneChangeDetection } from "@angular/core";

TestBed.configureTestingModule({
  providers: [provideZoneChangeDetection()],
});`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { provideZoneChangeDetection as alias } from "@angular/core";

bootstrapApplication(AppComponent, {
  providers: [alias({ eventCoalescing: true })],
});`, errors: [error] },
  ],
});
