import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "to-signal-in-injection-context";
const messageId = "toSignalInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`toSignal()\` must be called in an injection context, or an \`Injector\` must be provided in the second argument object, or \`manualCleanup\` must be enabled.`,
    },
    docs: {
      description: `Checks that \`toSignal()\` is called in an injection context, or is called with an explicit \`Injector\` or \`manualCleanup\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/TO_SIGNAL.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core/rxjs-interop'] > ImportSpecifier[imported.name='toSignal']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            /* Takes an `Injector` or `manualCleanup` in second argument object: `toSignal(obs, { injector })` or `toSignal(obs, { manualCleanup })` */
            !isCalledWithProperty(node, 1, 'injector') &&
            !isCalledWithProperty(node, 1, 'manualCleanup') &&
            !isInInjectionContext(node)
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
