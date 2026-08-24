import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularClass } from "../../utils/angular-class-decorator";

export const ruleName = "no-directive-accessor";
const messageId = "noDirectiveAccessor";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `Getters and setters of components and directives should be avoided, as in a zoneless application, their recomputation does not update the UI anymore. Use \`computed()\` instead.`,
    },
    docs: {
      description: `Checks that accessors of components and directives are not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_DIRECTIVE_ACCESSOR.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "MethodDefinition[kind='get'][key.type!='PrivateIdentifier'], MethodDefinition[kind='set'][key.type!='PrivateIdentifier']"(node: TSESTree.MethodDefinition) {
        if (isInAngularClass(node, ["Component", "Directive"])) {
          context.report({
            node,
            messageId,
          });
        }
      },
    };
  },
};
