import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-provider-deps";
const messageId = "noProviderDeps";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Using \`deps\` to inject dependencies in a provider is a legacy feature, use \`inject()\` instead.`,
    },
    docs: {
      description: `Checks that \`deps()\` is not used in a provider.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_PROVIDER_DEPS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Property[key.type='Identifier'][key.name='deps']"(node: TSESTree.Property) {
        if (
          node.parent.type === 'ObjectExpression' &&
          node.parent.properties.some(
            property =>
              property.type === 'Property' &&
              property.key.type === 'Identifier' &&
              property.key.name === 'provide',
          )
        ) {
          context.report({
            node,
            messageId,
          });
        };

      },
    };
  },
};
