import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-inject-decorator";
const messageId = "noInjectDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@Inject()\` is a legacy feature, use \`inject()\` instead.`,
    },
    docs: {
      description: `Checks that \`Inject()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_INJECT_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator > CallExpression[callee.type='Identifier'][callee.name='Inject']"(node: TSESTree.Decorator) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
