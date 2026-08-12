import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-material-modules";
const messageId = "noMaterialModules";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Material modules should be avoided in a standalone application, use the standalone version, for example \`MatButton\` instead of \`MatButtonModule\`.`,
    },
    docs: {
      description: `Checks that Material modules are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_MATERIAL_MODULES.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name=/^Mat.+Module$/]"(node: TSESTree.Identifier) {
        if (!isImportIdentifier(node)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
