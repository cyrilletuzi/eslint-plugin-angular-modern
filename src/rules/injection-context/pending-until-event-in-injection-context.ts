import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";

export const ruleName = "pending-until-event-in-injection-context";
const messageId = "pendingUntilEventInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`pendingUntilEvent()\` must be called in an injection context, or an \`Injector\` must be provided as the first argument.`,
    },
    docs: {
      description: `Checks that \`pendingUntilEvent()\` is called in an injection context, or is called with an explicit \`Injector\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/PENDING_UNTIL_EVENT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core/rxjs-interop'] > ImportSpecifier[imported.name='pendingUntilEvent']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            /* Takes an `Injector` as first argument: `pendingUntilEvent(this.injector)` */
            node.arguments.length < 1 && !isInInjectionContext(node, {
              includeRouting: true,
              includeHttp: true,
              includeAsyncAppInitializationFunctions: true,
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
