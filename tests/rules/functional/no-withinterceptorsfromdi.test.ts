import * as rule from "../../../src/rules/functional/no-withinterceptorsfromdi.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithinterceptorsfromdi" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `import { withInterceptorsFromDi } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient(withInterceptors([authInterceptor]))] });`,
    /* Import only (not a call) */
    `import { withInterceptorsFromDi } from '@angular/common/http';`,
    /* Reference without call */
    `import { withInterceptorsFromDi } from '@angular/common/http'; const f = withInterceptorsFromDi;`,
    `import { withInterceptorsFromDi } from '@angular/common/http'; const features = [withInterceptorsFromDi];`,
    /* Method calls on any object are not reported */
    `import { withInterceptorsFromDi } from '@angular/common/http'; http.withInterceptorsFromDi();`,
    `import { withInterceptorsFromDi } from '@angular/common/http'; this.withInterceptorsFromDi();`,
    /* Look-alike names */
    `import { withInterceptorsFromDi } from '@angular/common/http'; withInterceptorsFromDis(); mywithInterceptorsFromDi(); withinterceptorsfromdi();`,
    /* String, not a call */
    `import { withInterceptorsFromDi } from '@angular/common/http'; const a = 'withInterceptorsFromDi()';`,
    /* Function declaration with the same name */
    `function withInterceptorsFromDi() {}`,
    /* Same name imported from another library is not reported */
    `import { withInterceptorsFromDi } from 'other-lib'; provideHttpClient(withInterceptorsFromDi());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; bootstrapApplication(App, { providers: [provideHttpClient(withInterceptorsFromDi())] });`, errors: [error] },
    /* Among other features */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; provideHttpClient(withFetch(), withInterceptorsFromDi(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; withInterceptorsFromDi();`, errors: [error] },
    /* With arguments */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; provideHttpClient(withInterceptorsFromDi(a, b));`, errors: [error] },
    /* Optional call */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; withInterceptorsFromDi?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withInterceptorsFromDi } from '@angular/common/http'; provideHttpClient(withInterceptorsFromDi());`,
      errors: [error],
    },
    /* Several calls */
    { code: `import { withInterceptorsFromDi } from '@angular/common/http'; withInterceptorsFromDi(); withInterceptorsFromDi();`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { withInterceptorsFromDi as alias } from '@angular/common/http'; provideHttpClient(alias());`, errors: [error] },
  ],
});
