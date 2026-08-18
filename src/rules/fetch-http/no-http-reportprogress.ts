import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularHttpClientMethodCall, isInAngularHttpClientOptionsVariable } from "../../utils/angular-http-client";

export const ruleName = "no-http-reportprogress";
const messageId = "noHttpReportprogress";

export const ruleDefinition: RuleDefinition = {
  meta: {
    type: "problem",
    messages: {
      [messageId]: `HttpClient \`reportProgress\` option is deprecated, use \`reportDownloadProgress\` instead.`,
    },
    docs: {
      description: `Checks that HttpClient \`reportProgress\` option is not used.`,
      url: 'https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/fetch-http/NO_HTTP_REPORTPROGRESS.md',
      recommended: true,
    },
    schema: [],
  },
  create(context) {
    return {
      "Property[key.type='Identifier'][key.name='reportProgress']"(node: TSESTree.Property) {
        const object = node.parent;

        if (object.type !== "ObjectExpression") {
          return;
        }

        /* Case 1: literal object in a HttpClient method */
        if (isInAngularHttpClientMethodCall(object)) {
          context.report({
            node,
            messageId,
          });
        }

        /* Case 2: literal object in variable with `HttpClientCommonOptions` or `HttpRequestOptions` type */
        if (isInAngularHttpClientOptionsVariable(object)) {
          context.report({
            node,
            messageId,
          });
        }

      },
    };
  },
};
