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
    /* Look-alike names */
    `const a = [MyHTTP_INTERCEPTORS, HTTP_INTERCEPTORSs, http_interceptors];`,
    /* String, not a usage */
    `import { HTTP_INTERCEPTORS } from '@angular/common/http'; const a = 'HTTP_INTERCEPTORS';`,
    /* Not reported: namespace import member */
    `import * as ng from '@angular/common/http'; const a = ng.HTTP_INTERCEPTORS;`,
    /* Not reported: default and namespace imports with the same name */
    `import HTTP_INTERCEPTORS from '@angular/common/http';`,
    `import * as HTTP_INTERCEPTORS from '@angular/common/http';`,
    // Not reported: re-export without import (not a usage)
    `export { HTTP_INTERCEPTORS } from '@angular/common/http';`,
    // Not reported: unrelated object key with the same name
    `import { HTTP_INTERCEPTORS } from '@angular/common/http'; const o = { HTTP_INTERCEPTORS: true };`,
  ],
  invalid: [
    /* Classic usage */
    { code: `import { HTTP_INTERCEPTORS } from '@angular/common/http'; @NgModule({ providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }] }) class AppModule {}`, errors: [error] },
    /* Injection */
    { code: `import { HTTP_INTERCEPTORS } from '@angular/common/http'; const a = inject(HTTP_INTERCEPTORS);`, errors: [error] },
    /* Type usage */
    { code: `import { HTTP_INTERCEPTORS } from '@angular/common/http'; let a: HTTP_INTERCEPTORS;`, errors: [error] },
    /* Several usages */
    { code: `import { HTTP_INTERCEPTORS } from '@angular/common/http'; @NgModule({ providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }] }) class AppModule {} const a = inject(HTTP_INTERCEPTORS);`, errors: [error, error] },
    // Aliased import is reported
    { code: `import { HTTP_INTERCEPTORS as Alias } from '@angular/common/http'; @NgModule({ providers: [{ provide: Alias, useClass: AuthInterceptor, multi: true }] }) class AppModule {}`, errors: [error] },
  ],
});
