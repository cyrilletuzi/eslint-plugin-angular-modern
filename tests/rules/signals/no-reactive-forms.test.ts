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

/* Rules only check APIs imported from Angular */
const importAll = `import { ${names.join(", ")} } from "@angular/forms";`;

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
    // Each name: the import itself is not reported, only usages are
    ...names.map((name) => `import { ${name} } from "@angular/forms";`),
    ...names.map((name) => `import type { ${name} } from "@angular/forms";`),
    // Template-driven forms are not targeted
    `${importAll} @Component({ imports: [FormsModule] }) class A {}`,
    // Look-alike names (typo in doc example, case, prefix/suffix)
    `${importAll} @Component({ imports: [ReactiveFormModule, reactiveFormsModule, MyFormControl, FormControls, formGroup] }) class A {}`,
    // Other forms APIs are deliberately not reported
    // Directives are only usable through `ReactiveFormsModule` (already reported), and `AbstractControl` / `Validators` are shared with template-driven forms
    `import { FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, AbstractControl, Validators } from "@angular/forms"; const a = [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName, AbstractControl, Validators];`,
    // A string is not a usage
    `${importAll} const a = "FormControl";`,
    // A native private member is not a usage
    `${importAll} class A { #FormControl = 1; }`,
    // Each name: usage without import is not reported
    ...names.map((name) => `const a = ${name};`),
    // ACCEPTED FALSE NEGATIVE: with a namespace import, `forms.FormControl` is not reported
    `import * as forms from "@angular/forms"; new forms.FormControl("");`,
    // Not reported: object keys and unrelated local declarations with the same name
    `${importAll} const a = { FormGroup: 1 };`,
    `class FormControl {}`,
    // Not reported: default and namespace imports with the same name
    `import FormControl from "some-lib";`,
    `import * as FormGroup from "some-lib";`,
    // Not reported: re-export without import (not a usage)
    `export { FormControl } from "@angular/forms";`,
    // Not reported: same local name imported from another library
    `import { Other as FormControl } from "other-lib"; new FormControl();`,
  ],
  invalid: [
    // Doc example (`ReactiveFormModule` typo is not reported, `FormControl` and `FormGroup` are)
    {
      code: `
        import { FormControl, FormGroup } from "@angular/forms";

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
    // Each name: usage (only the usage is reported, not the import)
    ...names.map((name) => ({ code: `import { ${name} } from "@angular/forms"; const a = ${name};`, errors: [{ messageId }] })),
    // Each name: type annotation
    ...names.map((name) => ({ code: `import type { ${name} } from "@angular/forms"; let a: ${name};`, errors: [{ messageId }] })),
    // Module in component `imports`
    { code: `import { ReactiveFormsModule } from "@angular/forms"; @Component({ imports: [ReactiveFormsModule] }) class A {}`, errors: [{ messageId }] },
    // Injection
    { code: `import { FormBuilder, NonNullableFormBuilder } from "@angular/forms"; class A { readonly fb = inject(FormBuilder); readonly nnfb = inject(NonNullableFormBuilder); }`, errors: [{ messageId }, { messageId }] },
    { code: `import { FormBuilder } from "@angular/forms"; class A { constructor(private fb: FormBuilder) {} }`, errors: [{ messageId }] },
    // Instantiation with generic type arguments
    { code: `import { FormControl, FormGroup } from "@angular/forms"; const a = new FormGroup<{ name: FormControl<string> }>({ name: new FormControl("") });`, errors: [{ messageId }, { messageId }, { messageId }] },
    { code: `import { FormArray, FormRecord } from "@angular/forms"; const a = new FormArray([]); const b = new FormRecord({});`, errors: [{ messageId }, { messageId }] },
    // Aliased import is reported
    { code: `import { FormControl as Control } from "@angular/forms"; const a = new Control("");`, errors: [{ messageId }] },
  ],
});
