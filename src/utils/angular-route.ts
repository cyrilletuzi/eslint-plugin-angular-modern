import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";
import { isAfterAwait } from "./await-detection";

export function isInRoute(node: TSESTree.Node): boolean {
  // Check the variable type is `Route` or `Routes`
  const variableDeclarator = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.VariableDeclarator,
    { notInCallback: true },
  );

  const typeAnnotation = variableDeclarator?.id.typeAnnotation?.typeAnnotation;

  if (
    typeAnnotation?.type === AST_NODE_TYPES.TSTypeReference &&
    typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
    ["Routes", "Route"].includes(typeAnnotation.typeName.name) &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  return false;
}