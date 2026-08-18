import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-withxhr";
const messageId = "noWithxhr";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withXhr()\` enables back legacy XHR based HTTP, stay on the default fetch based HTTP instead.`,
    },
    docs: {
      description: `Checks that \`withXhr()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/fetch-http/NO_WITHXHR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='withXhr']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
