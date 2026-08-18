import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-httpinterceptors-token";
const messageId = "noHttpinterceptorsToken";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HTTP_INTERCEPTORS\` is for providing legacy class-based interceptors, use \`provideHttpClient(withInterceptors())\` with functional interceptors instead.`,
    },
    docs: {
      description: `Checks that \`HTTP_INTERCEPTORS\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_HTTPINTERCEPTORS_TOKEN.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='HTTP_INTERCEPTORS']"(node: TSESTree.Identifier) {
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
