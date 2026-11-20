import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";
import { getDecoratorProperty } from "../../utils/ast-decorator-property";

export const ruleName = "no-injectable-decorator";
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
      "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name='Injectable']"(importNode: TSESTree.ImportSpecifier) {
        /* Check the import source, but report at decorator sites */
        for (const node of getImportedDecorators(context, importNode)) {
          const providedIn = getDecoratorProperty(node, "providedIn");

          /* `providedIn: 'platform'` is the only exception allowed, not expressable with `@Service()` */
          if (
            providedIn?.value.type === "Literal" &&
            providedIn.value.value === 'platform'
          ) {
            continue;
          }

          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
