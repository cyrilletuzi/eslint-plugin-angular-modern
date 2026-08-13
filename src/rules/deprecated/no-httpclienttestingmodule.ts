import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-httpclienttestingmodule";
const messageId = "noHttpclienttestingmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HttpClientTestingModule\` should be avoided in a standalone application and is deprecated, use \`provideHttpClientTesting()\` instead.`,
    },
    docs: {
      description: `Checks that \`HttpClientTestingModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTTESTINGMODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='HttpClientTestingModule']"(node: TSESTree.Identifier) {
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
