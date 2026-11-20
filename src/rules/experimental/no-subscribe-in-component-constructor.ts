import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { addAngularClassDecoratorImport, angularClassDecoratorImportSelector, type AngularClassDecoratorImports } from "../../utils/angular-class-decorator";
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
    const angularDecorators: AngularClassDecoratorImports = new Map();

    return {
      [angularClassDecoratorImportSelector](node: TSESTree.ImportSpecifier) {
        addAngularClassDecoratorImport(angularDecorators, node);
      },
      "CallExpression > MemberExpression.callee[property.type='Identifier'][property.name='subscribe'][computed=false]"(node: TSESTree.CallExpression) {
        if (isInAngularComponentConstructor(node, angularDecorators)) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
