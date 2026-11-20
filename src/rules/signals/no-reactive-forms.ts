import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-reactive-forms";
const messageId = "noReactiveForms";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Using legacy reactive forms should be avoided in a zoneless application, use signals \`form()\` instead.`,
    },
    docs: {
      description: `Checks that \`ReactiveFormsModule\`, \`FormBuilder\`, \`FormControl\`, \`FormGroup\`, \`FormArray\`, \`FormRecord\` and all their variants are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_REACTIVE_FORMS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/forms'] > ImportSpecifier[imported.name=/^(ReactiveFormsModule|FormBuilder|NonNullableFormBuilder|UntypedFormBuilder|FormControl|FormGroup|FormArray|FormRecord|UntypedFormControl|UntypedFormGroup|UntypedFormArray|UntypedFormRecord)$/]"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at usage sites */
        for (const node of getImportedReferences(context, importNode)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
