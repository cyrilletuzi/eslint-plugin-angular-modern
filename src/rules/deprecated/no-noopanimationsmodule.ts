import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-noopanimationsmodule";
const messageId = "noNoopanimationsmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`NoopAnimationsModule\` should be avoided in a standalone application, is deprecated and is planned for removal; in the meantime, use \`provideNoopAnimations()\` instead.`,
    },
    docs: {
      description: `Checks that \`NoopAnimationsModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_NOOPANIMATIONSMODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='NoopAnimationsModule']"(node: TSESTree.Identifier) {
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
