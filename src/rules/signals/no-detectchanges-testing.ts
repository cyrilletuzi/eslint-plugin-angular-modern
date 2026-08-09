import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularClass } from "../../utils/angular-class-decorator";

export const ruleName = "no-detectchanges-testing";
const messageId = "noDetectchangesTesting";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `\`fixture.detectChanges()\` should be avoided in a zoneless application, use \`await fixture.whenStable()\` instead.`,
    },
    docs: {
      description: `Checks that \`fixture.detectChanges()\` is not called.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_DETECTCHANGES_TESTING.md',
    },
    schema: [],
  },
  create(context) {
    return {
      "CallExpression > MemberExpression[property.type='Identifier'][property.name='detectChanges'][computed=false]"(node: TSESTree.CallExpression) {
        if (
          // Report only in tests, otherwise it will report on `ChangeDetectorRef.detectChanges()`
          !isInAngularClass(node, ["Component", "Directive"])
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
