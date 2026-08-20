import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

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
      "Identifier[name=/^(?:Cdk[A-Za-z0-9]+|A11y|Bidi|Clipboard|Dialog|DragDrop|Layout|Observers|Overlay|Platform|Portal|Scrolling|TextField)Module$/]"(node: TSESTree.Identifier) {
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
