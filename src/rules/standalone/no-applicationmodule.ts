import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-applicationmodule";
const messageId = "noApplicationmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ApplicationModule\` is useless in a standalone application, it is automatically included by \`bootstrapApplication()\`.`,
    },
    docs: {
      description: `Checks that \`ApplicationModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_APPLICATIONMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='ApplicationModule']"(node: TSESTree.Identifier) {
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
