import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

function isInConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.MethodDefinition,
  );
  if (methodDefinition?.kind === "constructor") {
    return true;
  }
  return false;
}

export function isInAngularComponentConstructor(node: TSESTree.Node): boolean {
  if (isInConstructor(node)) {
    const classDeclaration = findNearestAncestorOf(
      node,
      (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
    );

    if (
      classDeclaration &&
      findAngularClassDecorator(classDeclaration, ["Component"])
    ) {
      return true;
    }
  }
  return false;
}

