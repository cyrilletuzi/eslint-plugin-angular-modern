import * as rule from "../../../src/rules/functional/no-withinterceptorsfromdi.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noWithinterceptorsfromdi" } as const;

testRule(rule, {
  valid: [
    /* Modern alternative */
    `bootstrapApplication(App, { providers: [provideHttpClient(withInterceptors([authInterceptor]))] });`,
    /* Import only (not a call) */
    `import { withInterceptorsFromDi } from '@angular/common/http';`,
    /* Reference without call */
    `const f = withInterceptorsFromDi;`,
    `const features = [withInterceptorsFromDi];`,
    /* Member expression call (callee is not an Identifier) */
    `http.withInterceptorsFromDi();`,
    `this.withInterceptorsFromDi();`,
    /* Look-alike names */
    `withInterceptorsFromDis(); mywithInterceptorsFromDi(); withinterceptorsfromdi();`,
    /* String, not a call */
    `const a = 'withInterceptorsFromDi()';`,
    /* Function declaration with the same name */
    `function withInterceptorsFromDi() {}`,
    // SUSPECTED BUG: an aliased import is not followed, the call of the alias is not reported
    `import { withInterceptorsFromDi as alias } from '@angular/common/http'; provideHttpClient(alias());`,
  ],
  invalid: [
    /* Classic usage in `provideHttpClient()` */
    { code: `bootstrapApplication(App, { providers: [provideHttpClient(withInterceptorsFromDi())] });`, errors: [error] },
    /* Among other features */
    { code: `provideHttpClient(withFetch(), withInterceptorsFromDi(), withXsrfConfiguration({}));`, errors: [error] },
    /* Standalone call */
    { code: `withInterceptorsFromDi();`, errors: [error] },
    /* With arguments */
    { code: `provideHttpClient(withInterceptorsFromDi(a, b));`, errors: [error] },
    /* Optional call */
    { code: `withInterceptorsFromDi?.();`, errors: [error] },
    /* Import and usage: only the call is reported */
    {
      code: `import { withInterceptorsFromDi } from '@angular/common/http'; provideHttpClient(withInterceptorsFromDi());`,
      errors: [error],
    },
    /* Several calls */
    { code: `withInterceptorsFromDi(); withInterceptorsFromDi();`, errors: [error, error] },
  ],
});
