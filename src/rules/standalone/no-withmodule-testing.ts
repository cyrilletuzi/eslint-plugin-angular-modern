import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-withmodule-testing";
const messageId = "noWithmoduleTesting";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`withModule()\` should be avoided in a standalone application, use \`TestBed.configureTestingModule()\` instead.`,
    },
    docs: {
      description: `Checks that \`withModule()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_WITHMODULE_TESTING.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core/testing'] > ImportSpecifier[imported.name='withModule']"(importNode: TSESTree.ImportSpecifier) {
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
