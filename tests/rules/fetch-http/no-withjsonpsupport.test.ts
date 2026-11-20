import * as rule from "../../../src/rules/fetch-http/no-withjsonpsupport.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithjsonpsupport" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `import { withJsonpSupport } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient()] });`,
    /* Import only (not a call) */
    `import { withJsonpSupport } from '@angular/common/http';`,
    /* Reference without call */
    `import { withJsonpSupport } from '@angular/common/http'; const f = withJsonpSupport;`,
    `import { withJsonpSupport } from '@angular/common/http'; const features = [withJsonpSupport];`,
    /* Method calls on any object are not reported */
    `import { withJsonpSupport } from '@angular/common/http'; http.withJsonpSupport();`,
    `import { withJsonpSupport } from '@angular/common/http'; this.withJsonpSupport();`,
    /* Look-alike names */
    `import { withJsonpSupport } from '@angular/common/http'; withJsonpSupports(); mywithJsonpSupport(); withjsonpsupport();`,
    /* String, not a call */
    `import { withJsonpSupport } from '@angular/common/http'; const a = 'withJsonpSupport()';`,
    /* Function declaration with the same name */
    `function withJsonpSupport() {}`,
    /* Same name imported from another library is not reported */
    `import { withJsonpSupport } from 'other-lib'; provideHttpClient(withJsonpSupport());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `import { withJsonpSupport } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient(withJsonpSupport())] });`, errors: [error] },
    /* Among other features */
    { code: `import { withJsonpSupport } from '@angular/common/http'; provideHttpClient(withFetch(), withJsonpSupport(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `import { withJsonpSupport } from '@angular/common/http'; withJsonpSupport();`, errors: [error] },
    /* With arguments */
    { code: `import { withJsonpSupport } from '@angular/common/http'; provideHttpClient(withJsonpSupport(a, b));`, errors: [error] },
    /* Optional call */
    { code: `import { withJsonpSupport } from '@angular/common/http'; withJsonpSupport?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withJsonpSupport } from '@angular/common/http'; provideHttpClient(withJsonpSupport());`,
      errors: [error],
    },
    /* Several calls */
    { code: `import { withJsonpSupport } from '@angular/common/http'; withJsonpSupport(); withJsonpSupport();`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { withJsonpSupport as alias } from '@angular/common/http'; provideHttpClient(alias());`, errors: [error] },
  ],
});
