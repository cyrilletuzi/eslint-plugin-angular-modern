import type { RuleDefinition } from "@eslint/core";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-ngmodule-directive";
const messageId = "noNgmoduleDirective";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`standalone: false\` creates a NgModule-based directive, use a standalone directive instead.`,
    },
    docs: {
      description: `Checks that \`standalone: false\` is not used in a directive.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/experimental/NO_NGMODULE_DIRECTIVE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Directive']"(node: TSESTree.Decorator) {
        const standalone = getDecoratorProperty(node, "standalone");

        if (
          standalone?.value.type === AST_NODE_TYPES.Literal &&
          standalone.value.value === false
        ) {
          context.report({
            node: standalone,
            messageId,
          });
        }
      },
    };
  },
};
