import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-eager-change-detection";
const messageId = "noEagerChangeDetection";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`ChangeDetectionStrategy.Eager\` and \`ChangeDetectionStrategy.Default\` should not be used in a zoneless application, use \`ChangeDetectionStrategy.OnPush\` instead (the default in Angular >= 22).`,
    },
    docs: {
      description: `Checks that \`ChangeDetectionStrategy.Eager\` and \`ChangeDetectionStrategy.Default\` are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_EAGER_CHANGE_DETECTION.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='ChangeDetectionStrategy']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at usage sites */
        for (const reference of getImportedReferences(context, importNode)) {
          const node = reference.parent;
          if (
            node.type === "MemberExpression" &&
            node.object === reference &&
            node.property.type === "Identifier" &&
            (node.property.name === "Eager" || node.property.name === "Default")
          ) {
            context.report({
              node,
              messageId,
            });
          }
        }
      },
    };
  },
};
