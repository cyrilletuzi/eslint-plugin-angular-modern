import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-ngondestroy";
const messageId = "noNgondestroy";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ngOnDestroy()\` should be avoided in a zoneless application, signals and resources destroy is automatic; if really needed, use \`DestroyRef.onDestroy()\`.`,
    },
    docs: {
      description: `Checks that \`ngOnDestroy()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGONDESTROY.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "MethodDefinition[key.type='Identifier'][key.name='ngOnDestroy']"(node: TSESTree.MethodDefinition) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
