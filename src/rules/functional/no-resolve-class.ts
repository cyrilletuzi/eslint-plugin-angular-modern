import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-resolve-class";
const messageId = "noResolveClass";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`Resolve\` is to declare a legacy class-based resolver, use \`ResolveFn\` with a functional resolver instead.`,
    },
    docs: {
      description: `Checks that \`Resolve\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_RESOLVE_CLASS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/router'] > ImportSpecifier[imported.name='Resolve']"(importNode: TSESTree.ImportSpecifier) {
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
