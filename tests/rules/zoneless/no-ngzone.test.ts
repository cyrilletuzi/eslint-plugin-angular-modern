import * as rule from "../../../src/rules/zoneless/no-ngzone.js";
import { testRule } from "../../rule-tester.js";

const error = { messageId: "noNgzone" };

testRule(rule, {
  valid: [
    // The import itself is not reported, only usages are
    `import { NgZone } from "@angular/core";`,
    `import { Other, NgZone } from "@angular/core";`,
    // Type-only imports alone are not reported either
    `import type { NgZone } from "@angular/core";`,
    `import { type NgZone } from "@angular/core";`,
    // Aliased imports alone are not reported either
    `import { NgZone as Alias } from "@angular/core";`,
    `import { Other as NgZone } from "other-lib";`,
    // Look-alike names are not reported
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
    // Not a usage: strings, comments, computed access with a string
    `import { NgZone } from "@angular/core"; const name = "NgZone";`,
    `import { NgZone } from "@angular/core"; // NgZone`,
    `import { NgZone } from "@angular/core"; const value = ng["NgZone"];`,
    // Usage without import is not reported
    `@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(NgZone);
}`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as ng from "@angular/core";

const a = ng.NgZone;`,
    `import { NgZone } from "@angular/core"; const a = foo.bar.NgZone;`,
    // Not reported: local declaration with the same name
    `class NgZone {}`,
    // Not reported: same local name imported from another library
    `import { Other as NgZone } from "other-lib";

const a = NgZone;`,
    // Not reported: default, namespace and import-equals declarations with the same name
    `import NgZone from "@angular/core";`,
    `import * as NgZone from "@angular/core";`,
    `import { NgZone } from "@angular/core"; import NgZone = require("@angular/core");`,
    // Not reported: re-exports without import (not a usage)
    `export { NgZone as Alias } from "@angular/core";`,
    `export * as NgZone from "@angular/core";`,
    // Not reported: re-export without import (not a usage)
    `export { NgZone } from "@angular/core";`,
    // Not reported: non-reference identifiers like object keys
    `import { NgZone } from "@angular/core"; const a = { NgZone: true };`,
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
    // Each occurrence is reported
    {
      code: `import { NgZone } from "@angular/core";

const a = NgZone;
const b = [NgZone];`,
      errors: [error, error],
    },
    // Member expression object (static access)
    {
      code: `import { NgZone } from "@angular/core"; NgZone.toString();`,
      errors: [error],
    },
    // Type positions
    {
      code: `import { NgZone } from "@angular/core"; let a: NgZone;`,
      errors: [error],
    },
    {
      code: `import { NgZone } from "@angular/core"; type T = typeof NgZone;`,
      errors: [error],
    },
    // Nested positions
    {
      code: `import { NgZone } from "@angular/core";

function f() {
  return () => ({ imports: [[NgZone]] });
}`,
      errors: [error],
    },
    {
      code: `import { NgZone } from "@angular/core";

export { NgZone };`,
      errors: [error],
    },
    {
      code: `import { NgZone } from "@angular/core"; const a = { NgZone };`,
      errors: [error],
    },
    {
      code: `import { NgZone } from "@angular/core"; const { NgZone } = a;`,
      errors: [error],
    },
    // Constructor parameter type
    {
      code: `import { NgZone } from "@angular/core";

@Component({ template: "" })
export class SomeComponent {
  constructor(private zone: NgZone) {}
}`,
      errors: [error],
    },
    // Static method call
    {
      code: `import { NgZone } from "@angular/core"; if (NgZone.isInAngularZone()) {}`,
      errors: [error],
    },
    // Instantiation
    {
      code: `import { NgZone } from "@angular/core"; const zone = new NgZone({ enableLongStackTrace: false });`,
      errors: [error],
    },
    // Provider token
    {
      code: `import { NgZone } from "@angular/core"; const providers = [{ provide: NgZone, useClass: NoopNgZone }];`,
      errors: [error],
    },
    // Aliased import is reported
    { code: `import { NgZone as Alias } from "@angular/core";

@Component({
  template: "",
})
export class SomeComponent {
  private readonly zone = inject(Alias);
}`, errors: [error] },
  ],
});
