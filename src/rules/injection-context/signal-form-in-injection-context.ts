import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInInjectionContext } from "../../utils/angular-injection-context";
import { isCalledWithProperty } from "../../utils/ast-call-argument";

export const ruleName = "signal-form-in-injection-context";
const messageId = "signalFormInInjectionContext";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`form()\` must be called in an injection context, or an \`Injector\` must be provided in the second or third argument object.`,
    },
    docs: {
      description: `Checks that signal \`form()\` is called in an injection context, or is called with an explicit \`Injector\` as an argument.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/SIGNAL_FORM.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression[callee.type='Identifier'][callee.name='form']"(node: TSESTree.CallExpression) {
        if (
          /* Takes an `Injector` in second or third argument object: `form(source, { injector })` or `form(source, schema, { injector })` */
          !(node.arguments.length === 3 && isCalledWithProperty(node, 2, 'injector')) &&
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
