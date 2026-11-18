import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-platformbrowser-animations-import";
const messageId = "noPlatformbrowserAnimationsImport";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@angular/platform-browser/animations\` is deprecated and only needed by deprecated \`@angular/animations\`: once no component uses \`@angular/animations\` anymore, remove the animations providers.`,
    },
    docs: {
      description: `Checks that \`@angular/platform-browser/animations\` is not imported.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/native-animations/NO_PLATFORMBROWSER_ANIMATIONS_IMPORT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      /* Also includes `@angular/platform-browser/animations/async` */
      "ImportDeclaration[source.value=/^@angular\\/platform-browser\\/animations(?:\\/|$)/]"(node: TSESTree.ImportDeclaration) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
