import * as rule from "../../../src/rules/fetch-http/no-withxhr.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithxhr" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `import { withXhr } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient()] });`,
    /* Import only (not a call) */
    `import { withXhr } from '@angular/common/http';`,
    /* Reference without call */
    `import { withXhr } from '@angular/common/http'; const f = withXhr;`,
    `import { withXhr } from '@angular/common/http'; const features = [withXhr];`,
    /* Method calls on any object are not reported */
    `import { withXhr } from '@angular/common/http'; http.withXhr();`,
    `import { withXhr } from '@angular/common/http'; this.withXhr();`,
    /* Look-alike names */
    `import { withXhr } from '@angular/common/http'; withXhrs(); mywithXhr(); withxhr();`,
    /* String, not a call */
    `import { withXhr } from '@angular/common/http'; const a = 'withXhr()';`,
    /* Function declaration with the same name */
    `function withXhr() {}`,
    /* Same name imported from another library is not reported */
    `import { withXhr } from 'other-lib'; provideHttpClient(withXhr());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `import { withXhr } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient(withXhr())] });`, errors: [error] },
    /* Among other features */
    { code: `import { withXhr } from '@angular/common/http'; provideHttpClient(withFetch(), withXhr(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `import { withXhr } from '@angular/common/http'; withXhr();`, errors: [error] },
    /* With arguments */
    { code: `import { withXhr } from '@angular/common/http'; provideHttpClient(withXhr(a, b));`, errors: [error] },
    /* Optional call */
    { code: `import { withXhr } from '@angular/common/http'; withXhr?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withXhr } from '@angular/common/http'; provideHttpClient(withXhr());`,
      errors: [error],
    },
    /* Several calls */
    { code: `import { withXhr } from '@angular/common/http'; withXhr(); withXhr();`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { withXhr as alias } from '@angular/common/http'; provideHttpClient(alias());`, errors: [error] },
  ],
});
