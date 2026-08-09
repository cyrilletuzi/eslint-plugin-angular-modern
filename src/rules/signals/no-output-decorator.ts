import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-output-decorator";
const messageId = "noOutputDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`Output()\` should not be used in a zoneless application, use \`output()\` instead.`,
    },
    docs: {
      description: `Checks that \`Output()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_OUTPUT_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name='Output']"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
