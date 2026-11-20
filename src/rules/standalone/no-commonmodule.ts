import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-commonmodule";
const messageId = "noCommonmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CommonModule\` should be avoided in a standalone application, use the new control flow syntax instead and standalone pipes.`,
    },
    docs: {
      description: `Checks that \`CommonModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_COMMONMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/common'] > ImportSpecifier[imported.name='CommonModule']"(importNode: TSESTree.ImportSpecifier) {
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
