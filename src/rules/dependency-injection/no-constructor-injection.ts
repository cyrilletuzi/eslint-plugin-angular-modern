import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { addAngularClassDecoratorImport, angularClassDecoratorImportSelector, isInImportedAngularClass, type AngularClassDecoratorImports } from "../../utils/angular-class-decorator";

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
    const angularDecorators: AngularClassDecoratorImports = new Map();

    return {
      [angularClassDecoratorImportSelector](node: TSESTree.ImportSpecifier) {
        addAngularClassDecoratorImport(angularDecorators, node);
      },
      "MethodDefinition[kind='constructor']"(node: TSESTree.MethodDefinition) {
        /* Cheapest check first: modern constructors have no parameters */
        if (
          node.value.params.length > 0 &&
          isInImportedAngularClass(node, angularDecorators, ["Component", "Directive", "Pipe", "Injectable"])
        ) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
