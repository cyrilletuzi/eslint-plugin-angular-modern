import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-routertestingmodule";
const messageId = "noRoutertestingmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`RouterTestingModule\` should be avoided in a standalone application and is deprecated, use \`provideRouter()\` instead.`,
    },
    docs: {
      description: `Checks that \`RouterTestingModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_ROUTERTESTINGMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='RouterTestingModule']"(node: TSESTree.Identifier) {
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
