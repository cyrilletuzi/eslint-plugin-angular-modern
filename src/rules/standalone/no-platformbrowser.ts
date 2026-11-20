import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-platformbrowser";
const messageId = "noPlatformbrowser";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`platformBrowser()\` should be avoided in a standalone application, use \`bootstrapApplication()\` instead.`,
    },
    docs: {
      description: `Checks that \`platformBrowser()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_PLATFORMBROWSER.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/platform-browser'] > ImportSpecifier[imported.name='platformBrowser']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
