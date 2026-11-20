import type { TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

function isInProperty(node: TSESTree.Node): boolean {
  const propertyDefinition = findNearestAncestorOf(
    node,
    /* Auto-accessors (`accessor a = inject(A)`) are initialized at construction too */
    (node) => node.type === "PropertyDefinition" || node.type === "AccessorProperty",
    { notInCallback: true },
  );
  /* Static fields are initialized when the class is defined, not when it is instantiated */
  if (propertyDefinition && !propertyDefinition.static) {
    return true;
  }
  return false;
}

function isInConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === "MethodDefinition",
    { notInCallback: true },
  );
  if (methodDefinition?.kind === "constructor") {
    return true;
  }
  return false;
}

export function isInAngularClassInitialization(node: TSESTree.Node): boolean {
  // Start with field initializer, as it is the most common case, and it does not require traversal
  if (node.type === "PropertyDefinition" || isInProperty(node) || isInConstructor(node)) {
    const classDeclaration = findNearestAncestorOf(
      node,
      (node) => node.type === "ClassDeclaration",
    );

    if (
      classDeclaration &&
      /* An abstract class can only be instantiated by a child class, which is supposed to be an Angular class */
      (classDeclaration.abstract || findAngularClassDecorator(classDeclaration))
    ) {
      return true;
    }
  }
  return false;
}

