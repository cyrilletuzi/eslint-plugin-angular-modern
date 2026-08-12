import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-httpclientxsrfmodule";
const messageId = "noHttpclientxsrfmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HttpClientXsrfModule\` should be avoided in a standalone application and is deprecated, use \`withXsrfConfiguration()\` instead.`,
    },
    docs: {
      description: `Checks that \`HttpClientXsrfModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_HTTPCLIENTXSRFMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='HttpClientXsrfModule']"(node: TSESTree.Identifier) {
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
