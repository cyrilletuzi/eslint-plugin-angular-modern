import type { RuleDefinition } from "@eslint/core";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-ngmodule-component";
const messageId = "noNgmoduleComponent";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`standalone: false\` creates a NgModule-based component, use a standalone component instead.`,
    },
    docs: {
      description: `Checks that \`standalone: false\` is not used in a component.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_NGMODULE_COMPONENT.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Component']"(node: TSESTree.Decorator) {
        if (node.expression.type !== AST_NODE_TYPES.CallExpression) {
          return;
        }

        const config = node.expression.arguments[0];

        if (
          !config ||
          config.type !== AST_NODE_TYPES.ObjectExpression
        ) {
          return;
        }

        const standalone = config.properties.find(
          (property) =>
            property.type === AST_NODE_TYPES.Property &&
            property.key.type === AST_NODE_TYPES.Identifier &&
            property.key.name === 'standalone',
        );

        if (
          standalone?.type === AST_NODE_TYPES.Property &&
          standalone.value.type === AST_NODE_TYPES.Literal &&
          standalone.value.value === false
        ) {
          context.report({
            node: standalone,
            messageId,
          });
        }
      },
    };
  },
};
