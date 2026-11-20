import * as rule from "../../../src/rules/functional/no-httpinterceptors-token.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpinterceptorsToken" } as const;

testRule(rule, {
  valid: [
    /* Import specifier (both imported and local Identifiers are skipped) */
    `import { HTTP_INTERCEPTORS } from '@angular/common/http';`,
    `import { Other, HTTP_INTERCEPTORS } from '@angular/common/http';`,
    /* Aliased import: the imported name is skipped */
    `import { HTTP_INTERCEPTORS as Alias } from '@angular/common/http';`,
    // SUSPECTED BUG: an aliased import is not followed, the usage of the alias is not reported
    `import { HTTP_INTERCEPTORS as Alias } from '@angular/common/http'; @NgModule({ providers: [{ provide: Alias, useClass: AuthInterceptor, multi: true }] }) class AppModule {}`,
    /* Look-alike names */
    `const a = [MyHTTP_INTERCEPTORS, HTTP_INTERCEPTORSs, http_interceptors];`,
    /* String, not an Identifier */
    `const a = 'HTTP_INTERCEPTORS';`,
  ],
  invalid: [
    /* Classic usage */
    { code: `@NgModule({ providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }] }) class AppModule {}`, errors: [error] },
    /* Import and usage: only the usage is reported */
    { code: `import { HTTP_INTERCEPTORS } from '@angular/common/http'; @NgModule({ providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }] }) class AppModule {}`, errors: [error] },
    /* Injection */
    { code: `const a = inject(HTTP_INTERCEPTORS);`, errors: [error] },
    /* Type usage */
    { code: `let a: HTTP_INTERCEPTORS;`, errors: [error] },
    /* Namespace import member */
    { code: `import * as ng from '@angular/common/http'; const a = ng.HTTP_INTERCEPTORS;`, errors: [error] },
    /* Default and namespace-like import specifiers are not ImportSpecifier */
    { code: `import HTTP_INTERCEPTORS from '@angular/common/http';`, errors: [error] },
    { code: `import * as HTTP_INTERCEPTORS from '@angular/common/http';`, errors: [error] },
    /* Re-export: both local and exported Identifiers are visited */
    // SUSPECTED BUG: a single re-export is reported twice
    { code: `export { HTTP_INTERCEPTORS } from '@angular/common/http';`, errors: [error, error] },
    // SUSPECTED BUG: any non-import Identifier with this name is reported, even an unrelated object key
    { code: `const o = { HTTP_INTERCEPTORS: true };`, errors: [error] },
    /* Several usages */
    { code: `@NgModule({ providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }] }) class AppModule {} const a = inject(HTTP_INTERCEPTORS);`, errors: [error, error] },
  ],
});
