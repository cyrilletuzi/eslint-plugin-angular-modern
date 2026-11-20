import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "after-render-effect-in-injection-context";
const messageId = "afterRenderEffectInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`afterRenderEffect()\` must be called in an injection context, or an \`Injector\` must be provided in the second argument object.`,
    },
    docs: {
      description: `Checks that \`afterRenderEffect()\` is called in an injection context, or is called with an explicit \`Injector\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/AFTER_RENDER_EFFECT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='afterRenderEffect']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            /* Takes an `Injector` in second argument object: `afterRenderEffect(() => {}, { injector })` */
            !isCalledWithProperty(node, 1, 'injector') &&
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
