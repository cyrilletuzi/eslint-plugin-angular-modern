import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";

export const ruleName = "no-inject-decorator";
const messageId = "noInjectDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@Inject()\` is a legacy feature, use \`inject()\` instead.`,
    },
    docs: {
      description: `Checks that \`Inject()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_INJECT_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='Inject']"(importNode: TSESTree.ImportSpecifier) {
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
