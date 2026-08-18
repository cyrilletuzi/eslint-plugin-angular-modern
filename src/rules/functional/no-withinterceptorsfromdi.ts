import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-withinterceptorsfromdi";
const messageId = "noWithinterceptorsfromdi";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withInterceptorsFromDi()\` is for providing legacy class-based interceptors, use \`withInterceptors()\` with functional interceptors instead.`,
    },
    docs: {
      description: `Checks that \`withInterceptorsFromDi()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_WITHINTERCEPTORSFROMDI.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='withInterceptorsFromDi']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
