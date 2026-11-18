import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-platformbrowserdynamic";
const messageId = "noPlatformbrowserdynamic";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`platformBrowserDynamic()\` should be avoided in a standalone application and is deprecated, use \`bootstrapApplication()\` instead.`,
    },
    docs: {
      description: `Checks that \`platformBrowserDynamic()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_PLATFORMBROWSERDYNAMIC.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='platformBrowserDynamic']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
