import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

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
      "ImportDeclaration[source.value='@angular/platform-browser-dynamic'] > ImportSpecifier[imported.name='platformBrowserDynamic']"(importNode: TSESTree.ImportSpecifier) {
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
