import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedReferences } from "../../utils/angular-import";

export const ruleName = "no-httpxhrbackend";
const messageId = "noHttpxhrbackend";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`HttpXhrBackend\` enables back legacy XHR based HTTP, stay on the default fetch based HTTP instead.`,
    },
    docs: {
      description: `Checks that \`HttpXhrBackend\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/fetch-http/NO_HTTPXHRBACKEND.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/common/http'] > ImportSpecifier[imported.name='HttpXhrBackend']"(importNode: TSESTree.ImportSpecifier) {
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
