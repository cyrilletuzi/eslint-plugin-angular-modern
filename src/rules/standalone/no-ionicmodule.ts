import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-ionicmodule";
const messageId = "noIonicmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`IonicModule\` should be avoided in a standalone application and is deprecated, use the standalone components and directives, and \`provideIonicAngular()\` for initialization.`,
    },
    docs: {
      description: `Checks that \`IonicModule\` not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_IONICMODULE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@ionic/angular'] > ImportSpecifier[imported.name='IonicModule']"(importNode: TSESTree.ImportSpecifier) {
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
