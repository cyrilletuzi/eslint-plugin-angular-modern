import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedFunctionCalls } from "../../utils/angular-import";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "rx-resource-in-injection-context";
const messageId = `rxResourceInInjectionContext`;

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`rxResource()\` must be called in an injection context, or an \`Injector\` must be provided in the argument object.`,
    },
    docs: {
      description: `Checks that \`rxResource()\` is called in an injection context, or is called with an explicit \`Injector\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/RX_RESOURCE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core/rxjs-interop'] > ImportSpecifier[imported.name='rxResource']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at call sites */
        for (const node of getImportedFunctionCalls(context, importNode)) {
          if (
            /* Takes an `Injector` in argument: `rxResource({ stream, injector })` */
            !isCalledWithProperty(node, 0, 'injector') &&
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
