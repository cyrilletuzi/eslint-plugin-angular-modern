import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-withxhr";
const messageId = "noWithxhr";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withXhr()\` enables back legacy XHR based HTTP, stay on the default fetch based HTTP instead.`,
    },
    docs: {
      description: `Checks that \`withXhr()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/fetch-http/NO_WITHXHR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/common/http'] > ImportSpecifier[imported.name='withXhr']"(importNode: TSESTree.ImportSpecifier) {
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
