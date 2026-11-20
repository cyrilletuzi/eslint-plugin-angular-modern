import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";

export const ruleName = "no-providezonechangedetection";
const messageId = "noProvidezonechangedetection";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`provideZoneChangeDetection()\` is forbidden in a zoneless application.`,
    },
    docs: {
      description: `Checks that \`provideZoneChangeDetection()\` is not called.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/zoneless/NO_PROVIDEZONECHANGEDETECTION.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='provideZoneChangeDetection']"(importNode: TSESTree.ImportSpecifier) {
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
