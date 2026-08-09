import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-content-decorator";
const messageId = "noContentDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ContentChild()\` and \`ContentChildren()\` should not be used in a zoneless application, use \`contentChild()\` and \`contentChildren()\` instead.`,
    },
    docs: {
      description: `Checks that \`ContentChild()\` and \`ContentChildren()\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_CONTENT_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name=/^(ContentChild|ContentChildren)$/]"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
