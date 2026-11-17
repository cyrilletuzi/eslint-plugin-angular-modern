import type { TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";

export function isInjectionContextAsserted(node: TSESTree.Node): boolean {
  // Check there is an `assertInInjectionContext` call in the same block
  const blockStatement = findNearestAncestorOf(
    node,
    (node) => node.type === "BlockStatement",
    { notInCallback: true },
  );

  const assertCall = blockStatement?.body.find(
    (body) =>
      body.type === "ExpressionStatement" &&
      body.expression.type === "CallExpression" &&
      body.expression.callee.type === "Identifier" &&
      body.expression.callee.name === "assertInInjectionContext",
  );

  if (assertCall !== undefined) {
    return true;
  }

  const conditionalAssertCall = blockStatement?.body.find(
    (body) =>
      body.type === "IfStatement" &&
      body.consequent.type === "BlockStatement" &&
      body.consequent.body.find((consequentBody) =>
        consequentBody.type === "ExpressionStatement" &&
        consequentBody.expression.type === "CallExpression" &&
        consequentBody.expression.callee.type === "Identifier" &&
        consequentBody.expression.callee.name === "assertInInjectionContext",
      )
  );

  if (conditionalAssertCall !== undefined) {
    return true;
  }

  return false;
}