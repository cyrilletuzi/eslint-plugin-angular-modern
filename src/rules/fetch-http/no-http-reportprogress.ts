import type { RuleDefinition } from "@eslint/core";
import type { TSESTree } from "@typescript-eslint/utils";

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
        const httpMethods = new Set([
          "get",
          "post",
          "put",
          "delete",
          "patch",
          "head",
          "options",
          "request",
        ]);

        if (
          /* Parent is the method call */
          object.parent.type === "CallExpression" &&
          object.parent.callee.type === "MemberExpression" &&
          object.parent.callee.property.type === "Identifier" &&
          httpMethods.has(object.parent.callee.property.name)
        ) {
          context.report({
            node,
            messageId,
          });
        }

        /* Case 2: literal object in variable with `HttpClientCommonOptions` or `HttpRequestOptions` type */
        if (
          /* Parent is the variable declarator */
          object.parent.type === "VariableDeclarator" &&
          object.parent.init === object &&
          object.parent.id.type === "Identifier" &&
          /* Check the type */
          object.parent.id.typeAnnotation?.typeAnnotation.type === "TSTypeReference" &&
          object.parent.id.typeAnnotation.typeAnnotation.typeName.type === "Identifier" &&
          ["HttpClientCommonOptions", "HttpRequestOptions"].includes(object.parent.id.typeAnnotation.typeAnnotation.typeName.name)
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
