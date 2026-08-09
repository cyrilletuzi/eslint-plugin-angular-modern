import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";

export function isInjectionContextAsserted(node: TSESTree.Node): boolean {
  // Check there is an `assertInInjectionContext` call in the same block
  const blockStatement = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.BlockStatement,
    { notInCallback: true },
  );

  const assertCall = blockStatement?.body.find(
    (body) =>
      body.type === AST_NODE_TYPES.ExpressionStatement &&
      body.expression.type === "CallExpression" &&
      body.expression.callee.type === AST_NODE_TYPES.Identifier &&
      body.expression.callee.name === "assertInInjectionContext",
  );

  if (assertCall !== undefined) {
    return true;
  }

  const conditionalAssertCall = blockStatement?.body.find(
    (body) =>
      body.type === AST_NODE_TYPES.IfStatement &&
      body.consequent.type === AST_NODE_TYPES.BlockStatement &&
      body.consequent.body.find((consequentBody) =>
        consequentBody.type === AST_NODE_TYPES.ExpressionStatement &&
        consequentBody.expression.type === "CallExpression" &&
        consequentBody.expression.callee.type === AST_NODE_TYPES.Identifier &&
        consequentBody.expression.callee.name === "assertInInjectionContext",
      )
  );

  if (conditionalAssertCall !== undefined) {
    return true;
  }

  return false;
}