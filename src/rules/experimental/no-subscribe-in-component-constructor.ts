import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularComponentConstructor } from "../../utils/in-constructor";

export const ruleName = "no-subscribe-in-component-constructor";
const messageId = "noSubscribeInComponentConstructor";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `An observable inside a component constructor can generally be managed with \`toSignal()\` or \`rxResource()\` instead.`,
    },
    docs: {
      description: `Checks that observables are not explicitly subscribed in components constructors.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/experimental/NO_SUBSCRIBE_IN_COMPONENT_CONSTRUCTOR.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression > MemberExpression[property.type='Identifier'][property.name='subscribe'][computed=false]"(node: TSESTree.CallExpression) {
        if (isInAngularComponentConstructor(node)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
