import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-httpclientjsonpmodule";
const messageId = "noHttpclientjsonpmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HttpClientJsonpModule\` should be avoided in a standalone application, is deprecated and is planned for removal; in the meantime, use \`withJsonpSupport()\` instead.`,
    },
    docs: {
      description: `Checks that \`HttpClientJsonpModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTJSONPMODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='HttpClientJsonpModule']"(node: TSESTree.Identifier) {
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
