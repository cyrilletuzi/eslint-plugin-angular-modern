import type { TSESTree } from "@typescript-eslint/utils";
import { getVariableType } from "./variable-type";

/**
 * Checks if a node is the child of a HttpClient method call.
 */
export function isInAngularHttpClientMethodCall(object: TSESTree.ObjectExpression): boolean {
  if (object.parent?.type !== "CallExpression" ||
    object.parent.callee.type !== "MemberExpression" ||
    object.parent.callee.property.type !== "Identifier") {
    return false;
  }

  const httpMethods: ReadonlySet<string> = new Set([
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "head",
    "options",
    "request",
  ]);

  return httpMethods.has(object.parent.callee.property.name);
}

/**
 * Checks if a node is in a variable of HttpClient options.
 */
export function isInAngularHttpClientOptionsVariable(object: TSESTree.ObjectExpression): boolean {
  if (object.parent === undefined) {
    return false;
  }

  const variableType = getVariableType(object.parent);

  if (variableType === undefined) {
    return false;
  }

  const httpClientOptionsInterfacesNames: ReadonlySet<string> = new Set(["HttpClientCommonOptions", "HttpRequestOptions"]);

  return httpClientOptionsInterfacesNames.has(variableType);
}

/**
 * Checks if a node is an argument of a `new HttpRequest()` (options are the 3rd or 4th argument depending on the HTTP method).
 */
export function isInAngularHttpRequestConstructor(object: TSESTree.ObjectExpression): boolean {
  return object.parent?.type === "NewExpression" &&
    object.parent.callee.type === "Identifier" &&
    object.parent.callee.name === "HttpRequest" &&
    object.parent.arguments.includes(object);
}
