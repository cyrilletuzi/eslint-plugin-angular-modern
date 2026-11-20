import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-withinterceptorsfromdi";
const messageId = "noWithinterceptorsfromdi";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withInterceptorsFromDi()\` is for providing legacy class-based interceptors, use \`withInterceptors()\` with functional interceptors instead.`,
    },
    docs: {
      description: `Checks that \`withInterceptorsFromDi()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_WITHINTERCEPTORSFROMDI.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/common/http'] > ImportSpecifier[imported.name='withInterceptorsFromDi']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
