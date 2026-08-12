import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-browseranimationsmodule";
const messageId = "noBrowseranimationsmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`BrowserAnimationsModule\` should be avoided in a standalone application, is deprecated and is planned for removal; in the meantime, use \`provideAnimations()\` or \`provideAnimationsAsync()\` instead.`,
    },
    docs: {
      description: `Checks that \`BrowserAnimationsModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_BROWSERANIMATIONSMODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='BrowserAnimationsModule']"(node: TSESTree.Identifier) {
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
