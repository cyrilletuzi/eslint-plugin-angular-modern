import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-view-decorator";
const messageId = "noViewDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ViewChild()\` and \`ViewChildren()\` should not be used in a zoneless application, use \`viewChild()\` and \`viewChildren()\` instead.`,
    },
    docs: {
      description: `Checks that \`ViewChild()\` and \`ViewChildren()\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_VIEW_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name=/^(ViewChild|ViewChildren)$/]"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
