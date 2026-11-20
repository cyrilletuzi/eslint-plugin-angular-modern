import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-changedetectorref";
const messageId = "noChangedetectorref";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ChangeDetectorRef()\` should be avoided in a zoneless application, use signals and resources reactivity instead.`,
    },
    docs: {
      description: `Checks that \`ChangeDetectorRef\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_CHANGEDETECTORREF.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='ChangeDetectorRef']"(importNode: TSESTree.ImportSpecifier) {
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
