import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-canload-class";
const messageId = "noCanloadClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanLoad\` is to declare a legacy class-based guard and is deprecated, use \`CanMatchFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanLoad\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_CANLOAD_CLASS.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='CanLoad']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
