import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-createngmodule";
const messageId = "noCreatengmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`createNgModule()\` should be avoided in a standalone application, use standalone components instead.`,
    },
    docs: {
      description: `Checks that \`createNgModule()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_CREATENGMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='createNgModule']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
