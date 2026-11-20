import * as rule from "../../../src/rules/fetch-http/no-withjsonpsupport.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithjsonpsupport" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `bootstrapApplication(App, { providers: [provideHttpClient()] });`,
    /* Import only (not a call) */
    `import { withJsonpSupport } from '@angular/common/http';`,
    /* Reference without call */
    `const f = withJsonpSupport;`,
    `const features = [withJsonpSupport];`,
    /* Member expression call (callee is not an Identifier) */
    `http.withJsonpSupport();`,
    `this.withJsonpSupport();`,
    /* Look-alike names */
    `withJsonpSupports(); mywithJsonpSupport(); withjsonpsupport();`,
    /* String, not a call */
    `const a = 'withJsonpSupport()';`,
    /* Function declaration with the same name */
    `function withJsonpSupport() {}`,
    // SUSPECTED BUG: an aliased import is not followed, the call of the alias is not reported
    `import { withJsonpSupport as alias } from '@angular/common/http'; provideHttpClient(alias());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `bootstrapApplication(App, { providers: [provideHttpClient(withJsonpSupport())] });`, errors: [error] },
    /* Among other features */
    { code: `provideHttpClient(withFetch(), withJsonpSupport(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `withJsonpSupport();`, errors: [error] },
    /* With arguments */
    { code: `provideHttpClient(withJsonpSupport(a, b));`, errors: [error] },
    /* Optional call */
    { code: `withJsonpSupport?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withJsonpSupport } from '@angular/common/http'; provideHttpClient(withJsonpSupport());`,
      errors: [error],
    },
    /* Several calls */
    { code: `withJsonpSupport(); withJsonpSupport();`, errors: [error, error] },
  ],
});
