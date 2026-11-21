import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";
import { getKeyName } from "../../utils/ast-property-key";

export const ruleName = "to-signal-in-injection-context";
const messageId = "toSignalInInjectionContext";

/**
 * `manualCleanup: false` is the default value, so it still requires an injection context.
 */
function isManualCleanupDisabled(node: TSESTree.CallExpression): boolean {
  const options = node.arguments[1];

  return options?.type === "ObjectExpression" && options.properties.some((property) =>
    property.type === "Property" &&
    getKeyName(property.key) === "manualCleanup" &&
    property.value.type === "Literal" &&
    property.value.value === false
  );
}

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
            !(
              isCalledWithProperty(node, 1, 'manualCleanup') &&
              !isManualCleanupDisabled(node)
            ) &&
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
