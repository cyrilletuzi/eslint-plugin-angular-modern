import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { getImportedDecorators } from "../../utils/angular-import";
import { getDecoratorOptions } from "../../utils/ast-decorator-property";
import { mayHaveKeyName } from "../../utils/ast-property-key";

export const ruleName = "no-injectable-decorator";
const messageId = "noInjectableDecorator";

/**
 * `'platform'`, `"platform"` or `` `platform` `` (backticks without interpolation)
 */
function isPlatform(value: TSESTree.Property["value"]): boolean {
  return (value.type === "Literal" && value.value === "platform") ||
    (value.type === "TemplateLiteral" && value.quasis.length === 1 && value.quasis[0]?.value.cooked === "platform");
}

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
          /* `providedIn: 'platform'` is the only exception allowed, not expressable with `@Service()` */
          /* The exception prevents a report, so a key with an unknown value, like `[key]`, may be `providedIn` */
          if (getDecoratorOptions(node)?.properties.some((property) =>
            property.type === "Property" &&
            mayHaveKeyName(property, "providedIn") &&
            isPlatform(property.value)
          )) {
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
