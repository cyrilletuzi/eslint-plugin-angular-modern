import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-browseranimationsmodule";
const messageId = "noBrowseranimationsmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`BrowserAnimationsModule\` should be avoided in a standalone application, is deprecated and is planned for removal; in the meantime, use \`provideAnimations()\` or \`provideAnimationsAsync()\` instead.`,
    },
    docs: {
      description: `Checks that \`BrowserAnimationsModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_BROWSERANIMATIONSMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/platform-browser/animations'] > ImportSpecifier[imported.name='BrowserAnimationsModule']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at usage sites */
        for (const node of getImportedReferences(context, importNode)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
