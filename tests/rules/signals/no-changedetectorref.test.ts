import * as rule from "../../../src/rules/signals/no-changedetectorref.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noChangedetectorref";

testRule(rule, {
  valid: [
    // Signals instead
    `@Component() class A { readonly a = signal(1); }`,
    // Import identifier (`ImportSpecifier` parent) is ignored to avoid double reports
    `import { ChangeDetectorRef } from "@angular/core";`,
    `import type { ChangeDetectorRef } from "@angular/core";`,
    // Aliased import: the imported name is ignored, and the local alias does not match
    // SUSPECTED BUG: `ChangeDetectorRef` used through an alias is not reported
    `import { ChangeDetectorRef as Cdr } from "@angular/core"; class A { readonly a = inject(Cdr); }`,
    // Local alias named `ChangeDetectorRef` is an import identifier too
    `import { Other as ChangeDetectorRef } from "other-lib";`,
    // Look-alike names
    `class A { readonly a = inject(changeDetectorRef); readonly b = inject(ChangeDetectionRef); readonly c = inject(ViewRef); readonly d = inject(ChangeDetectorRefs); }`,
    // Only the identifier is checked, not calls on an instance
    `this.cdr.markForCheck();`,
    // A string is not an `Identifier`
    `const a = "ChangeDetectorRef";`,
    // A native private member is a `PrivateIdentifier`
    `class A { #ChangeDetectorRef = 1; }`,
  ],
  invalid: [
    // Doc example: `inject()` in a component
    {
      code: `
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
    { code: `@Component() class A { constructor(private readonly cdr: ChangeDetectorRef) {} }`, errors: [{ messageId }] },
    // Not restricted to Angular classes, nor to classes
    { code: `@Injectable() class A { readonly a = inject(ChangeDetectorRef); }`, errors: [{ messageId }] },
    { code: `const cdr = TestBed.inject(ChangeDetectorRef);`, errors: [{ messageId }] },
    // Type positions
    { code: `let a: ChangeDetectorRef;`, errors: [{ messageId }] },
    { code: `let a: ChangeDetectorRef | undefined = inject(ChangeDetectorRef, { optional: true });`, errors: [{ messageId }, { messageId }] },
    // Member expression property (e.g. namespace import)
    { code: `import * as core from "@angular/core"; inject(core.ChangeDetectorRef);`, errors: [{ messageId }] },
    // Any `Identifier` is matched, whatever its position
    // SUSPECTED BUG: object keys and unrelated local declarations named `ChangeDetectorRef` are reported
    { code: `const a = { ChangeDetectorRef: 1 };`, errors: [{ messageId }] },
    { code: `abstract class ChangeDetectorRef {}`, errors: [{ messageId }] },
    // Only `ImportSpecifier` parents are ignored: default and namespace imports are reported
    { code: `import ChangeDetectorRef from "some-lib";`, errors: [{ messageId }] },
    { code: `import * as ChangeDetectorRef from "some-lib";`, errors: [{ messageId }] },
    // Re-export (`ExportSpecifier` parent) is reported
    // SUSPECTED BUG: reported twice, as `local` and `exported` are 2 distinct `Identifier` nodes
    { code: `export { ChangeDetectorRef } from "@angular/core";`, errors: [{ messageId }, { messageId }] },
    // Local alias named `ChangeDetectorRef` is not reported at import, but is reported on usage
    { code: `import { Other as ChangeDetectorRef } from "other-lib"; inject(ChangeDetectorRef);`, errors: [{ messageId }] },
  ],
});
