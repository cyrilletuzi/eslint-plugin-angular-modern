import type { RuleDefinition } from "@eslint/core";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-injectable-decator";
const messageId = "noInjectableDecorator";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`@Injectable()\` is a legacy feature, use \`@Service()\` instead.`,
    },
    docs: {
      description: `Checks that \`@Injectable()\` is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_INJECTABLE_DECORATOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Injectable']"(node: TSESTree.Decorator) {
        const providedIn = getDecoratorProperty(node, "providedIn");

        /* `providedIn: 'platform'` is the only exception allowed, not expressable with `@Service()` */
        if (
          providedIn?.value.type === AST_NODE_TYPES.Literal &&
          providedIn.value.value === 'platform'
        ) {
          return;
        }

        context.report({
          node,
          messageId,
        });
      },
    };
  },
};
