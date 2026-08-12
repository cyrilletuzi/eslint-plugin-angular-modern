import type { RuleDefinition } from "@eslint/core";
import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-ngmodule-pipe";
const messageId = "noNgmodulePipe";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`standalone: false\` creates a NgModule-based pipe, use a standalone pipe instead.`,
    },
    docs: {
      description: `Checks that \`standalone: false\` is not used in a pipe.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/experimental/NO_NGMODULE_PIPE.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Pipe']"(node: TSESTree.Decorator) {
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
