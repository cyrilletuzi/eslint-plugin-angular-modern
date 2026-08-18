import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-canactivate-class";
const messageId = "noCanactivateClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanActivate\` is to declare a legacy class-based guard, use \`CanActivateFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanActivate\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANACTIVATE_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='CanActivate']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
