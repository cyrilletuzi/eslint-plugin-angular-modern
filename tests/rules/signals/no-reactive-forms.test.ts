import * as rule from "../../../src/rules/signals/no-reactive-forms.js";
import { testRule } from "../../rule-tester.js";

const messageId = "noReactiveForms";

/** All the identifiers matched by the rule selector */
const names = [
  "ReactiveFormsModule",
  "FormBuilder",
  "NonNullableFormBuilder",
  "UntypedFormBuilder",
  "FormControl",
  "FormGroup",
  "FormArray",
  "FormRecord",
  "UntypedFormControl",
  "UntypedFormGroup",
  "UntypedFormArray",
  "UntypedFormRecord",
] as const;

testRule(rule, {
  valid: [
    // Doc example: signal forms
    `
      @Component({
        imports: [FormRoot, FormField],
        template: \`<form [formRoot]="form"><input type="text" [formField]="form.name" /></form>\`,
      })
      export class ProfileForm {
        readonly #formModel = signal({ name: "" });
        protected readonly form = form(this.#formModel);
      }
    `,
    // Each name: import identifier (`ImportSpecifier` parent) is ignored to avoid double reports
    ...names.map((name) => `import { ${name} } from "@angular/forms";`),
    ...names.map((name) => `import type { ${name} } from "@angular/forms";`),
    // Aliased import: the imported name is ignored, and the local alias does not match
    // SUSPECTED BUG: reactive forms used through an alias are not reported
    `import { FormControl as Control } from "@angular/forms"; const a = new Control("");`,
    // Template-driven forms are not targeted
    `@Component({ imports: [FormsModule] }) class A {}`,
    // Look-alike names (typo in doc example, case, prefix/suffix)
    `@Component({ imports: [ReactiveFormModule, reactiveFormsModule, MyFormControl, FormControls, formGroup] }) class A {}`,
    // Other reactive forms APIs are not in the list
    // SUSPECTED BUG: reactive forms directives and helpers (`FormControlDirective`, `FormGroupDirective`, `FormControlName`, `FormGroupName`, `FormArrayName`, `AbstractControl`) are not reported
    `const a = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, AbstractControl, Validators];`,
    // A string is not an `Identifier`
    `const a = "FormControl";`,
    // A native private member is a `PrivateIdentifier`
    `class A { #FormControl = 1; }`,
  ],
  invalid: [
    // Doc example (`ReactiveFormModule` typo is not reported, `FormControl` and `FormGroup` are)
    {
      code: `
        @Component({
          imports: [ReactiveFormModule],
          template: \`<form [formGroup]="form"><input type="text" [formControl]="nameControl" /></form>\`,
        })
        export class ProfileForm {
          protected nameControl = new FormControl("");
          protected readonly form = new FormGroup({
            name: nameControl,
          });
        }
      `,
      errors: [{ messageId }, { messageId }],
    },
    // Each name: usage without import
    ...names.map((name) => ({ code: `const a = ${name};`, errors: [{ messageId }] })),
    // Each name: usage with import (only the usage is reported)
    ...names.map((name) => ({ code: `import { ${name} } from "@angular/forms"; const a = ${name};`, errors: [{ messageId }] })),
    // Each name: type annotation
    ...names.map((name) => ({ code: `let a: ${name};`, errors: [{ messageId }] })),
    // Module in component `imports`
    { code: `@Component({ imports: [ReactiveFormsModule] }) class A {}`, errors: [{ messageId }] },
    // Injection
    { code: `class A { readonly fb = inject(FormBuilder); readonly nnfb = inject(NonNullableFormBuilder); }`, errors: [{ messageId }, { messageId }] },
    { code: `class A { constructor(private fb: FormBuilder) {} }`, errors: [{ messageId }] },
    // Instantiation with generic type arguments
    { code: `const a = new FormGroup<{ name: FormControl<string> }>({ name: new FormControl("") });`, errors: [{ messageId }, { messageId }, { messageId }] },
    { code: `const a = new FormArray([]); const b = new FormRecord({});`, errors: [{ messageId }, { messageId }] },
    // Member expression property (e.g. namespace import)
    { code: `import * as forms from "@angular/forms"; new forms.FormControl("");`, errors: [{ messageId }] },
    // Any `Identifier` is matched, whatever its position
    // SUSPECTED BUG: object keys and unrelated local declarations with these names are reported
    { code: `const a = { FormGroup: 1 };`, errors: [{ messageId }] },
    { code: `class FormControl {}`, errors: [{ messageId }] },
    // Only `ImportSpecifier` parents are ignored: default and namespace imports are reported
    { code: `import FormControl from "some-lib";`, errors: [{ messageId }] },
    { code: `import * as FormGroup from "some-lib";`, errors: [{ messageId }] },
    // Re-export (`ExportSpecifier` parent) is reported
    // SUSPECTED BUG: reported twice, as `local` and `exported` are 2 distinct `Identifier` nodes
    { code: `export { FormControl } from "@angular/forms";`, errors: [{ messageId }, { messageId }] },
    // Local alias named like a reactive forms API is not reported at import, but is reported on usage
    { code: `import { Other as FormControl } from "other-lib"; new FormControl();`, errors: [{ messageId }] },
  ],
});
