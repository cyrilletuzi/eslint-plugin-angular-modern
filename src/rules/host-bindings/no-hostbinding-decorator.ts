import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";

export const ruleName = "no-hostbinding-decorator";
const messageId = "noHostbindingDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@HostBinding()\` is a legacy feature, use \`host\` property instead.`,
    },
    docs: {
      description: `Checks that \`HostBinding()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/host-bindings/NO_HOSTBINDING_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='HostBinding']"(importNode: TSESTree.ImportSpecifier) {
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
