import * as rule from "../../../src/rules/signals/no-changedetectorref.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noChangedetectorref";

testRule(rule, {
  valid: [
    // Signals instead
    `@Component() class A { readonly a = signal(1); }`,
    // The import itself is not reported, only usages are
    `import { ChangeDetectorRef } from "@angular/core";`,
    `import type { ChangeDetectorRef } from "@angular/core";`,
    // Local alias named `ChangeDetectorRef` is an import identifier too
    `import { Other as ChangeDetectorRef } from "other-lib";`,
    // Look-alike names
    `class A { readonly a = inject(changeDetectorRef); readonly b = inject(ChangeDetectionRef); readonly c = inject(ViewRef); readonly d = inject(ChangeDetectorRefs); }`,
    // Only the identifier is checked, not calls on an instance
    `this.cdr.markForCheck();`,
    // A string is not a usage
    `import { ChangeDetectorRef } from "@angular/core"; const a = "ChangeDetectorRef";`,
    // A native private member is not a usage
    `import { ChangeDetectorRef } from "@angular/core"; class A { #ChangeDetectorRef = 1; }`,
    // Not reported: member expression property (namespace import or any other object)
    `import * as core from "@angular/core"; inject(core.ChangeDetectorRef);`,
    // Not reported: object keys and unrelated local declarations with the same name
    `import { ChangeDetectorRef } from "@angular/core"; const a = { ChangeDetectorRef: 1 };`,
    `abstract class ChangeDetectorRef {}`,
    // Not reported: default and namespace imports with the same name
    `import { ChangeDetectorRef } from "@angular/core"; import ChangeDetectorRef from "some-lib";`,
    `import { ChangeDetectorRef } from "@angular/core"; import * as ChangeDetectorRef from "some-lib";`,
    // Not reported: re-export without import (not a usage)
    `export { ChangeDetectorRef } from "@angular/core";`,
    // Not reported: same local name imported from another library
    `import { Other as ChangeDetectorRef } from "other-lib"; inject(ChangeDetectorRef);`,
  ],
  invalid: [
    // Doc example: `inject()` in a component
    {
      code: `import { ChangeDetectorRef } from "@angular/core";


        @Component()
        export class SomeComponent {
          readonly #changeDetectorRef = inject(ChangeDetectorRef);
        }
      `,
      errors: [{ messageId }],
    },
    // With the import, only the usage is reported
    { code: `import { ChangeDetectorRef } from "@angular/core"; class A { readonly a = inject(ChangeDetectorRef); }`, errors: [{ messageId }] },
    // Constructor injection (type annotation of a parameter property)
    { code: `import { ChangeDetectorRef } from "@angular/core"; @Component() class A { constructor(private readonly cdr: ChangeDetectorRef) {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes, nor to classes
    { code: `import { ChangeDetectorRef } from "@angular/core"; @Injectable() class A { readonly a = inject(ChangeDetectorRef); }`, errors: [{ messageId }] },
    { code: `import { ChangeDetectorRef } from "@angular/core"; const cdr = TestBed.inject(ChangeDetectorRef);`, errors: [{ messageId }] },
    // Type positions
    { code: `import { ChangeDetectorRef } from "@angular/core"; let a: ChangeDetectorRef;`, errors: [{ messageId }] },
    { code: `import { ChangeDetectorRef } from "@angular/core"; let a: ChangeDetectorRef | undefined = inject(ChangeDetectorRef, { optional: true });`, errors: [{ messageId }, { messageId }] },
    // Aliased import is reported
    { code: `import { ChangeDetectorRef as Cdr } from "@angular/core"; class A { readonly a = inject(Cdr); }`, errors: [{ messageId }] },
  ],
});
