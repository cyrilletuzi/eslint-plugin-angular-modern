import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-ngmodule-component";
const messageId = "noNgmoduleComponent";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`standalone: false\` creates a NgModule-based component, use a standalone component instead.`,
    },
    docs: {
      description: `Checks that \`standalone: false\` is not used in a component.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_NGMODULE_COMPONENT.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='Component']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at decorator sites */
        for (const node of getImportedDecorators(context, importNode)) {
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
        }
      },
    };
  },
};
