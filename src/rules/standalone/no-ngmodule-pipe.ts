import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
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
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_NGMODULE_PIPE.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Decorator[expression.callee.name='Pipe']"(node: TSESTree.Decorator) {
        const standalone = getDecoratorProperty(node, "standalone");

        if (
          standalone?.value.type === "Literal" &&
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
