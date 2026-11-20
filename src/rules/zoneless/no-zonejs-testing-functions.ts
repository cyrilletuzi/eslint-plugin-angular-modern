import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-zonejs-testing-functions";
const messageId = "noZonejsTestingFunctions";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `zone.js testing functions (\`fakeAsync()\`, \`discardPeriodicTasks()\`, \`flush()\`, \`flushMicrotasks()\`, \`resetFakeAsyncZone()\`, \`tick()\`, \`waitForAsync()\`) are useless and do not work in a zoneless application.`,
    },
    docs: {
      description: `Checks that zone.js testing functions are not called.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/zoneless/NO_ZONEJS_TESTING_FUNCTIONS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core/testing'] > ImportSpecifier[imported.name=/^(fakeAsync|discardPeriodicTasks|flush|flushMicrotasks|resetFakeAsyncZone|tick|waitForAsync)$/]"(importNode: TSESTree.ImportSpecifier) {
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
