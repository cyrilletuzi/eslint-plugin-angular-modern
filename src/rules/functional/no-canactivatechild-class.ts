import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-canactivatechild-class";
const messageId = "noCanactivatechildClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanActivateChild\` is to declare a legacy class-based guard, use \`CanActivateChildFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanActivateChild\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANACTIVATECHILD_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='CanActivateChild']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
