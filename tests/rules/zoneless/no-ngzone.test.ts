import * as rule from "../../../src/rules/zoneless/no-ngzone.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgzone" };

testRule(rule, {
  valid: [
    // Named import specifier alone is not reported (isImportIdentifier: parent is ImportSpecifier)
    `import { NgZone } from "@angular/core";`,
    `import { Other, NgZone } from "@angular/core";`,
    // Type-only imports are still ImportSpecifier
    `import type { NgZone } from "@angular/core";`,
    `import { type NgZone } from "@angular/core";`,
    // Both identifiers of an aliased specifier are inside the ImportSpecifier
    `import { NgZone as Alias } from "@angular/core";`,
    `import { Other as NgZone } from "other-lib";`,
    // SUSPECTED BUG: aliases are not followed, so usages of an aliased import are not reported (false negative)
    `import { NgZone as Alias } from "@angular/core";

@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(Alias);
}`,
    // Look-alike names (exact name match only)
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(MyNgZone);
}`,
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NgZones);
}`,
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NgZoneRef);
}`,
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(ngZone);
}`,
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NoopNgZone);
}`,
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(provideZoneChangeDetection);
}`,
    // Not an Identifier: strings, comments, computed access with a string
    `const name = "NgZone";`,
    `// NgZone`,
    `const value = ng["NgZone"];`,
  ],
  invalid: [
    // Usage with import: only the usage is reported, not the import specifier
    {
      code: `import { NgZone } from "@angular/core";

@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NgZone);
}`,
      errors: [error],
    },
    // Usage without import (name-based, no import source check)
    {
      code: `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NgZone);
}`,
      errors: [error],
    },
    // Each occurrence is reported
    {
      code: `import { NgZone } from "@angular/core";

const a = NgZone;
const b = [NgZone];`,
      errors: [error, error],
    },
    // Member expression property (e.g. namespace import)
    {
      code: `import * as ng from "@angular/core";

const a = ng.NgZone;`,
      errors: [error],
    },
    {
      code: `const a = foo.bar.NgZone;`,
      errors: [error],
    },
    // Member expression object (static access)
    {
      code: `NgZone.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `let a: NgZone;`,
      errors: [error],
    },
    {
      code: `type T = typeof NgZone;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `function f() {
  return () => ({ imports: [[NgZone]] });
}`,
      errors: [error],
    },
    // Local declaration with the same name
    {
      code: `class NgZone {}`,
      errors: [error],
    },
    // An aliased import whose local name is NgZone: the specifier is not reported, but usages are
    {
      code: `import { Other as NgZone } from "other-lib";

const a = NgZone;`,
      errors: [error],
    },
    // SUSPECTED BUG: default, namespace and import-equals declarations are not ImportSpecifier, so the import itself is reported (inconsistent with named imports)
    {
      code: `import NgZone from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import * as NgZone from "@angular/core";`,
      errors: [error],
    },
    {
      code: `import NgZone = require("@angular/core");`,
      errors: [error],
    },
    // Re-exports are reported (ExportSpecifier is not ImportSpecifier)
    {
      code: `export { NgZone as Alias } from "@angular/core";`,
      errors: [error],
    },
    {
      code: `export * as NgZone from "@angular/core";`,
      errors: [error],
    },
    // SUSPECTED BUG: in a shorthand export specifier, `local` and `exported` are the same node, which is visited twice, so the same location is reported twice
    {
      code: `export { NgZone } from "@angular/core";`,
      errors: [error, error],
    },
    {
      code: `import { NgZone } from "@angular/core";

export { NgZone };`,
      errors: [error, error],
    },
    // SUSPECTED BUG: non-reference identifiers like object keys are reported (false positive)
    {
      code: `const a = { NgZone: true };`,
      errors: [error],
    },
    // SUSPECTED BUG: shorthand property / destructuring: `key` and `value` are the same node, reported twice
    {
      code: `const a = { NgZone };`,
      errors: [error, error],
    },
    {
      code: `const { NgZone } = a;`,
      errors: [error, error],
    },
    // Constructor parameter type
    {
      code: `@Component({ template: "" })
export class SomeComponent {
  constructor(private zone: NgZone) {}
}`,
      errors: [error],
    },
    // Static method call
    {
      code: `if (NgZone.isInAngularZone()) {}`,
      errors: [error],
    },
    // Instantiation
    {
      code: `const zone = new NgZone({ enableLongStackTrace: false });`,
      errors: [error],
    },
    // Provider token
    {
      code: `const providers = [{ provide: NgZone, useClass: NoopNgZone }];`,
      errors: [error],
    },
  ],
});
