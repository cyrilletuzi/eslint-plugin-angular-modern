import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-canmatch-class";
const messageId = "noCanmatchClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanMatch\` is to declare a legacy class-based guard, use \`CanMatchFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanMatch\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANMATCH_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='CanMatch']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
