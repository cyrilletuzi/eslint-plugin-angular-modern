import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-resolve-class";
const messageId = "noResolveClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`Resolve\` is to declare a legacy class-based resolver, use \`ResolveFn\` with a functional resolver instead.`,
    },
    docs: {
      description: `Checks that \`Resolve\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_RESOLVE_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "TSClassImplements[expression.name='Resolve']"(node: TSESTree.TSClassImplements) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
