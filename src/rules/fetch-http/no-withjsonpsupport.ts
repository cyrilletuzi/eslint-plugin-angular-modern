import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-withjsonpsupport";
const messageId = "noWithjsonpsupport";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withJsonpSupport()\` is deprecated because of security issues, use regular HTTP requests with CORS instead.`,
    },
    docs: {
      description: `Checks that \`withJsonpSupport()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/fetch-http/NO_WITHJSONPSUPPORT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='withJsonpSupport']"(node: TSESTree.CallExpression) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
