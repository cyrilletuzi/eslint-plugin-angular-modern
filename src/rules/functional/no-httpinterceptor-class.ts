import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-httpinterceptor-class";
const messageId = "noHttpinterceptorClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HttpInterceptor\` is to declare a legacy class-based interceptor, use \`HttpInterceptorFn\` with a functional interceptor instead.`,
    },
    docs: {
      description: `Checks that \`HttpInterceptor\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_HTTPINTERCEPTOR_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='HttpInterceptor']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
