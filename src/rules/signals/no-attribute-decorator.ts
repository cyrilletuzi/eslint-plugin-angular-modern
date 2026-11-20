import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";

export const ruleName = "no-attribute-decorator";
const messageId = "noAttributeDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@Attribute()\` should not be used in a zoneless application, use \`input()\` instead.`,
    },
    docs: {
      description: `Checks that \`Attribute()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_ATTRIBUTE_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='Attribute']"(importNode: TSESTree.ImportSpecifier) {
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
