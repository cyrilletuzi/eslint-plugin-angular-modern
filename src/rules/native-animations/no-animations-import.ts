import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

export const ruleName = "no-animations-import";
const messageId = "noAnimationsImport";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@angular/animations\` is deprecated, use native CSS animations with \`animate.enter\` and \`animate.leave\` instead.`,
    },
    docs: {
      description: `Checks that \`@angular/animations\` is not imported.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/native-animations/NO_ANIMATIONS_IMPORT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      /* Also includes subpaths like `@angular/animations/browser` */
      "ImportDeclaration[source.value=/^@angular\\/animations(?:\\/|$)/]"(node: TSESTree.ImportDeclaration) {
        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
