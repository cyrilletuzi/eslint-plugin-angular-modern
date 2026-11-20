import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-canload-class";
const messageId = "noCanloadClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`CanLoad\` is to declare a legacy class-based guard and is deprecated, use \`CanMatchFn\` with a functional guard instead.`,
    },
    docs: {
      description: `Checks that \`CanLoad\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANLOAD_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/router'] > ImportSpecifier[imported.name='CanLoad']"(importNode: TSESTree.ImportSpecifier) {
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
