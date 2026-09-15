import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "httpresource-in-injection-context";
const messageId = `httpResourceInInjectionContext`;

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`httpResource()\` must be called in an injection context, or an \`Injector\` must be provided in the second argument object.`,
    },
    docs: {
      description: `Checks that \`httpResource()\` is called in an injection context, or is called with an explicit \`Injector\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/HTTPRESOURCE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='httpResource']"(node: TSESTree.CallExpression) {
        if (
          /* Takes an `Injector` in second argument: `httpResource(() => '/some/api/path', { injector })` */
          !isCalledWithProperty(node, 1, 'injector') &&
          !isInInjectionContext(node)
        ) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
