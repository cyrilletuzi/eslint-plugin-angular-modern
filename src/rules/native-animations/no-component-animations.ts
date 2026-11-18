import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-component-animations";
const messageId = "noComponentAnimations";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Component \`animations\` rely on deprecated \`@angular/animations\`, use native CSS animations with \`animate.enter\` and \`animate.leave\` instead.`,
    },
    docs: {
      description: `Checks that \`animations\` is not used in a component.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/native-animations/NO_COMPONENT_ANIMATIONS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Component']"(node: TSESTree.Decorator) {
        const animations = getDecoratorProperty(node, "animations");

        if (animations) {
          context.report({
            node: animations,
            messageId,
          });
        }
      },
    };
  },
};
