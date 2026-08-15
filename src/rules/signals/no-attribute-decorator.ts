import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-attribute-decorator";
const messageId = "noAttributeDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@Attribute()\` should not be used in a zoneless application, use \`input()\` instead.`,
    },
    docs: {
      description: `Checks that \`Attribute()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_ATTRIBUTE_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name='Attribute']"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
