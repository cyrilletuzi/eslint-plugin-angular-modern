import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";

export const ruleName = "inject-async-in-injection-context";
const messageId = "injectAsyncInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`injectAsync()\` must be called in an injection context.`,
    },
    docs: {
      description: `Checks that \`injectAsync()\` is called in an injection context.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/INJECT_ASYNC.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='injectAsync']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            !isInInjectionContext(node, {
              /* `injectAsync()` is accepted in all asynchronous-compatible injection contexts */
              includeRouting: true,
              includeHttp: true,
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
