import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";

export const ruleName = "no-view-decorator";
const messageId = "noViewDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ViewChild()\` and \`ViewChildren()\` should not be used in a zoneless application, use \`viewChild()\` and \`viewChildren()\` instead.`,
    },
    docs: {
      description: `Checks that \`ViewChild()\` and \`ViewChildren()\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_VIEW_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name=/^(ViewChild|ViewChildren)$/]"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at decorator sites */
        for (const { expression: node } of getImportedDecorators(context, importNode)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
