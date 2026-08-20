import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isImportIdentifier } from "../../utils/is-import-identifier";

export const ruleName = "no-ionic-module";
const messageId = "noIonicModule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`IonicModule\` should be avoided in a standalone application and is deprecated, use the standalone components and directives, and \`provideIonicAngular()\` for initialization.`,
    },
    docs: {
      description: `Checks that \`IonicModule\` not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_IONIC_MODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Identifier[name='IonicModule']"(node: TSESTree.Identifier) {
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
