import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

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
      "Identifier[name='ReactiveFormsModule'], Identifier[name='FormBuilder'], Identifier[name='NonNullableFormBuilder'], Identifier[name='UntypedFormBuilder'], Identifier[name='FormControl'], Identifier[name='FormGroup'], Identifier[name='FormArray'], Identifier[name='FormRecord'], Identifier[name='UntypedFormControl'], Identifier[name='UntypedFormGroup'], Identifier[name='UntypedFormArray'], Identifier[name='UntypedFormRecord']"(node: TSESTree.Identifier) {
        if (!isImportIdentifier(node)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
