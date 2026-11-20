import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";

export const ruleName = "inject-in-injection-context";
const messageId = "injectInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`inject()\` must be called in an injection context.`,
    },
    docs: {
      description: `Checks that \`inject()\` is called in an injection context.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/INJECT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='inject']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            !isInInjectionContext(node, {
              /* `inject()` is accepted in all injection contexts */
              includeRouting: true,
              includeHttp: true,
              includeFactories: true,
              includeAsyncAppInitializationFunctions: true,
              includeSyncAppInitializationFunctions: true,
            })
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
