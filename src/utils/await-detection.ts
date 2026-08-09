import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";

export function isAfterAwait(node: TSESTree.Node): boolean {
  // Check there is an `await` expression in the same block, before the node
  const blockStatement = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.BlockStatement,
    { notInCallback: true },
  );

  if (blockStatement === undefined) {
    return false;
  }

  const awaitExpression = blockStatement.body.find(
    (body) =>
      body.type === AST_NODE_TYPES.ExpressionStatement &&
      body.expression.type === AST_NODE_TYPES.AwaitExpression,
  );

  if (awaitExpression === undefined) {
    return false;
  }

  if (
    node.loc.end.line > awaitExpression.loc.start.line ||
    (node.loc.end.line === awaitExpression.loc.start.line &&
      node.loc.end.column > awaitExpression.loc.start.column)
  ) {
    return true;
  }

  return false;
}