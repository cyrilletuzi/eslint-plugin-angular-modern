import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularClass } from "../../utils/angular-class-decorator";

export const ruleName = "no-constructor-injection";
const messageId = "noConstructorInjection";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Using the constructor to inject dependencies is a legacy feature, use \`inject()\` instead.`,
    },
    docs: {
      description: `Checks that dependencies are not injected in constructors.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_CONSTRUCTOR_INJECTION.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "MethodDefinition[kind='constructor']"(node: TSESTree.MethodDefinition) {
        if (!isInAngularClass(node, ["Component", "Directive", "Pipe", "Injectable"])) {
          return;
        }

        if (node.value.params.length > 0) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
