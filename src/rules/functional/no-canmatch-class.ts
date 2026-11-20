import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-canmatch-class";
const messageId = "noCanmatchClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanMatch\` is to declare a legacy class-based guard, use \`CanMatchFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanMatch\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANMATCH_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/router'] > ImportSpecifier[imported.name='CanMatch']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at `implements` sites */
        for (const reference of getImportedReferences(context, importNode)) {
          const node = reference.parent;
          if (node.type === "TSClassImplements" && node.expression === reference) {
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
