import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-input-decorator";
const messageId = "noInputDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`Input()\` should not be used in a zoneless application, use \`input()\` instead.`,
    },
    docs: {
      description: `Checks that \`Input()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_INPUT_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name='Input']"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
