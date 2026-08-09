import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-eager-change-detection";
const messageId = "noEagerChangeDetection";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ChangeDetectionStrategy.Eager\` and \`ChangeDetectionStrategy.Default\` should not be used in a zoneless application, use \`ChangeDetectionStrategy.OnPush\` instead (the default in Angular >= 22).`,
    },
    docs: {
      description: `Checks that \`ChangeDetectionStrategy.Eager\` and \`ChangeDetectionStrategy.Default\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_EAGER_CHANGE_DETECTION.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "MemberExpression[object.type='Identifier'][object.name='ChangeDetectionStrategy'][property.type='Identifier'][property.name=/^(Eager|Default)$/]"(node: TSESTree.MemberExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
