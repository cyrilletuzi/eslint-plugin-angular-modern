import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-cdk-modules";
const messageId = "noCdkModules";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `CDK modules should be avoided in a standalone application, use the standalone version, for example \`CdkMenu\` and \`CdkMenuItem\` instead of \`CdkMenuModule\`.`,
    },
    docs: {
      description: `Checks that CDK modules are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_CDK_MODULES.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value=/^@angular\\/cdk/] > ImportSpecifier[imported.name=/Module$/]"(importNode: TSESTree.ImportSpecifier) {
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
