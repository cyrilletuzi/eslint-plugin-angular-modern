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
    /* String, not an Identifier */
    `const a = 'HttpXhrBackend';`,
    /* Usage through an alias: only the original name is detected */
    `const p = { provide: HttpBackend, useClass: XhrBackend };`,
  ],
  invalid: [
    /* Import: both the imported and local Identifiers of the ImportSpecifier are visited */
    // SUSPECTED BUG: the import is reported twice (imported + local Identifiers), unlike other rules which ignore import specifiers
    { code: `import { HttpXhrBackend } from '@angular/common/http';`, errors: [error, error] },
    /* Aliased import: only the imported name is reported, not the alias usage */
    {
      code: `import { HttpXhrBackend as XhrBackend } from '@angular/common/http'; const p = { provide: HttpBackend, useClass: XhrBackend };`,
      errors: [error],
    },
    /* Provider usage */
    { code: `const p = { provide: HttpBackend, useClass: HttpXhrBackend };`, errors: [error] },
    { code: `const p = { provide: HttpBackend, useExisting: HttpXhrBackend };`, errors: [error] },
    /* Injection and instantiation */
    { code: `const b = inject(HttpXhrBackend);`, errors: [error] },
    { code: `const b = new HttpXhrBackend(factory);`, errors: [error] },
    /* Type usage */
    { code: `let b: HttpXhrBackend;`, errors: [error] },
    /* Namespace member: the property Identifier is matched */
    { code: `const b = http.HttpXhrBackend;`, errors: [error] },
    /* Re-export: both the local and exported Identifiers are visited */
    // SUSPECTED BUG: reported twice for a single re-export
    { code: `export { HttpXhrBackend } from '@angular/common/http';`, errors: [error, error] },
    /* Import and usage */
    {
      code: `import { HttpXhrBackend } from '@angular/common/http'; const p = { provide: HttpBackend, useClass: HttpXhrBackend };`,
      errors: [error, error, error],
    },
    // SUSPECTED BUG: any Identifier with this name is reported, even an unrelated object key
    { code: `const o = { HttpXhrBackend: true };`, errors: [error] },
  ],
});
