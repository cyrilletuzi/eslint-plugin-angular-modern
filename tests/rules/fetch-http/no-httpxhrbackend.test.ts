import * as rule from "../../../src/rules/fetch-http/no-httpxhrbackend.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noHttpxhrbackend" } as const;

testRule(rule, {
  valid: [
    /* Default fetch based HTTP */
    `bootstrapApplication(App, { providers: [provideHttpClient()] });`,
    /* Other backends */
    `const p = { provide: HttpBackend, useClass: FetchBackend };`,
    /* Look-alike names */
    `const a = HttpXhrBackendX; const b = MyHttpXhrBackend; const c = httpXhrBackend;`,
    /* String, not a usage */
    `import { HttpXhrBackend } from '@angular/common/http'; const a = 'HttpXhrBackend';`,
    /* Usage through an alias: only the original name is detected */
    `const p = { provide: HttpBackend, useClass: XhrBackend };`,
    // Not reported: the import itself, only usages are reported
    `import { HttpXhrBackend } from '@angular/common/http';`,
    /* Not reported: namespace import member */
    `import { HttpXhrBackend } from '@angular/common/http'; const b = http.HttpXhrBackend;`,
    // Not reported: re-export without import (not a usage)
    `export { HttpXhrBackend } from '@angular/common/http';`,
    // Not reported: unrelated object key with the same name
    `import { HttpXhrBackend } from '@angular/common/http'; const o = { HttpXhrBackend: true };`,
  ],
  invalid: [
    /* Aliased import: only the imported name is reported, not the alias usage */
    {
      code: `import { HttpXhrBackend as XhrBackend } from '@angular/common/http'; const p = { provide: HttpBackend, useClass: XhrBackend };`,
      errors: [error],
    },
    /* Provider usage */
    { code: `import { HttpXhrBackend } from '@angular/common/http'; const p = { provide: HttpBackend, useClass: HttpXhrBackend };`, errors: [error] },
    { code: `import { HttpXhrBackend } from '@angular/common/http'; const p = { provide: HttpBackend, useExisting: HttpXhrBackend };`, errors: [error] },
    /* Injection and instantiation */
    { code: `import { HttpXhrBackend } from '@angular/common/http'; const b = inject(HttpXhrBackend);`, errors: [error] },
    { code: `import { HttpXhrBackend } from '@angular/common/http'; const b = new HttpXhrBackend(factory);`, errors: [error] },
    /* Type usage */
    { code: `import { HttpXhrBackend } from '@angular/common/http'; let b: HttpXhrBackend;`, errors: [error] },
  ],
});
