import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-httpinterceptors-token";
const messageId = "noHttpinterceptorsToken";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HTTP_INTERCEPTORS\` is for providing legacy class-based interceptors, use \`provideHttpClient(withInterceptors())\` with functional interceptors instead.`,
    },
    docs: {
      description: `Checks that \`HTTP_INTERCEPTORS\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_HTTPINTERCEPTORS_TOKEN.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/common/http'] > ImportSpecifier[imported.name='HTTP_INTERCEPTORS']"(importNode: TSESTree.ImportSpecifier) {
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
