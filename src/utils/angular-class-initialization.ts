import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

function isInProperty(node: TSESTree.Node): boolean {
  const propertyDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.PropertyDefinition,
    { notInCallback: true },
  );
  if (propertyDefinition) {
    return true;
  }
  return false;
}

function isInConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.MethodDefinition,
    { notInCallback: true },
  );
  if (methodDefinition?.kind === "constructor") {
    return true;
  }
  return false;
}

export function isInAngularClassInitialization(node: TSESTree.Node): boolean {
  // Start with field initializer, as it is the most common case, and it does not require traversal
  if (node.type === AST_NODE_TYPES.PropertyDefinition || isInProperty(node) || isInConstructor(node)) {
    const classDeclaration = findNearestAncestorOf(
      node,
      (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
    );

    if (
      classDeclaration &&
      findAngularClassDecorator(classDeclaration)
    ) {
      return true;
    }
  }
  return false;
}

