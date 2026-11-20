import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-noopanimationsmodule";
const messageId = "noNoopanimationsmodule";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`NoopAnimationsModule\` should be avoided in a standalone application, is deprecated and is planned for removal; in the meantime, use \`provideNoopAnimations()\` instead.`,
    },
    docs: {
      description: `Checks that \`NoopAnimationsModule\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_NOOPANIMATIONSMODULE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/platform-browser/animations'] > ImportSpecifier[imported.name='NoopAnimationsModule']"(importNode: TSESTree.ImportSpecifier) {
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
