import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-zonejs-import";
const messageId = "noZonejsImport";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Importing zone.js is forbidden in a zoneless application.`,
    },
    docs: {
      description: `Checks that \`zone.js\` is not imported.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/zoneless/NO_ZONEJS_IMPORT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='zone.js']"(node: TSESTree.ImportDeclaration) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
