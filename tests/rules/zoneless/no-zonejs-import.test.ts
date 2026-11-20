import * as rule from "../../../src/rules/zoneless/no-zonejs-import.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noZonejsImport" };

testRule(rule, {
  valid: [
    // Other modules, including names starting with `zone.js`
    `import "zone";`,
    `import "zone.jsx";`,
    `import "@angular/core";`,
    `import { NgZone } from "@angular/core";`,
    // Not an ImportDeclaration: dynamic import, require, re-exports
    `import("zone.js");`,
    `require("zone.js");`,
    `export * from "zone.js";`,
    `export {} from "zone.js";`,
    // Strings and comments
    `const name = "zone.js";`,
    `// import "zone.js";`,
  ],
  invalid: [
    // Doc example: side-effect import, both quote styles
    {
      code: `import 'zone.js';`,
      errors: [error],
    },
    {
      code: `import "zone.js";`,
      errors: [error],
    },
    // Any import form from "zone.js"
    {
      code: `import {} from "zone.js";`,
      errors: [error],
    },
    {
      code: `import * as Zone from "zone.js";`,
      errors: [error],
    },
    {
      code: `import Zone from "zone.js";`,
      errors: [error],
    },
    {
      code: `import type {} from "zone.js";`,
      errors: [error],
    },
    // Among other imports, one error per declaration
    {
      code: `import "@angular/localize/init";
import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";`,
      errors: [{ messageId: "noZonejsImport", line: 2, column: 1 }],
    },
    {
      code: `import "zone.js";
import "zone.js";`,
      errors: [error, error],
    },
    // Sub-entry points (e.g. the classic `test.ts` import)
    { code: `import "zone.js/testing";`, errors: [error] },
    { code: `import "zone.js/plugins/zone-error";`, errors: [error] },
    { code: `import "zone.js/dist/zone";`, errors: [error] },
  ],
});
