import * as rule from "../../../src/rules/fetch-http/no-withxhr.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithxhr" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `bootstrapApplication(App, { providers: [provideHttpClient()] });`,
    /* Import only (not a call) */
    `import { withXhr } from '@angular/common/http';`,
    /* Reference without call */
    `const f = withXhr;`,
    `const features = [withXhr];`,
    /* Member expression call (callee is not an Identifier) */
    `http.withXhr();`,
    `this.withXhr();`,
    /* Look-alike names */
    `withXhrs(); mywithXhr(); withxhr();`,
    /* String, not a call */
    `const a = 'withXhr()';`,
    /* Function declaration with the same name */
    `function withXhr() {}`,
    // SUSPECTED BUG: an aliased import is not followed, the call of the alias is not reported
    `import { withXhr as alias } from '@angular/common/http'; provideHttpClient(alias());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `bootstrapApplication(App, { providers: [provideHttpClient(withXhr())] });`, errors: [error] },
    /* Among other features */
    { code: `provideHttpClient(withFetch(), withXhr(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `withXhr();`, errors: [error] },
    /* With arguments */
    { code: `provideHttpClient(withXhr(a, b));`, errors: [error] },
    /* Optional call */
    { code: `withXhr?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withXhr } from '@angular/common/http'; provideHttpClient(withXhr());`,
      errors: [error],
    },
    /* Several calls */
    { code: `withXhr(); withXhr();`, errors: [error, error] },
  ],
});
