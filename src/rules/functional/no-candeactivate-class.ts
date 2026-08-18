import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-candeactivate-class";
const messageId = "noCandeactivateClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanDeactivate\` is to declare a legacy class-based guard, use \`CanDeactivateFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanDeactivate\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANDEACTIVATE_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='CanDeactivate']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
