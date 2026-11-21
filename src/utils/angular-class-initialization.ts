import type { TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import type { FunctionNode } from "./ast-traversal";

function isAngularOrAbstractClass(classNode: TSESTree.Node): boolean {
  return classNode.type === "ClassDeclaration" &&
    /* An abstract class can only be instantiated by a child class, which is supposed to be an Angular class */
    (classNode.abstract || findAngularClassDecorator(classNode) !== undefined);
}

/**
 * Checks if a field (or auto-accessor) is initialized at the construction of an Angular class.
 */
export function isAngularFieldInitialization(field: TSESTree.PropertyDefinition | TSESTree.AccessorProperty): boolean {
  /* Static fields are initialized when the class is defined, not when it is instantiated */
  return !field.static && isAngularOrAbstractClass(field.parent.parent);
}

/**
 * Checks if a function is the constructor of an Angular class.
 */
export function isAngularConstructor(functionNode: FunctionNode): boolean {
  const { parent } = functionNode;

  return parent.type === "MethodDefinition" &&
    parent.kind === "constructor" &&
    isAngularOrAbstractClass(parent.parent.parent);
}
