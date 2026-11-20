import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-browsertestingmodule";
const messageId = "noBrowsertestingmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`BrowserTestingModule\` and \`BrowserDynamicTestingModule\` are useless in a standalone application.`,
    },
    docs: {
      description: `Checks that \`BrowserTestingModule\` and \`BrowserDynamicTestingModule\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_BROWSERTESTINGMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/platform-browser/testing'] > ImportSpecifier[imported.name='BrowserTestingModule'], ImportDeclaration[source.value='@angular/platform-browser-dynamic/testing'] > ImportSpecifier[imported.name='BrowserDynamicTestingModule']"(importNode: TSESTree.ImportSpecifier) {
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
