import type { TSESTree } from "@typescript-eslint/utils";
import { isInImportedAngularClass, type AngularClassDecoratorImports } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

/**
 * Checks if a node runs during construction: in the constructor or in a field initializer.
 * Callbacks are included (e.g. `effect(() => {})`), but not a field whose value is directly a function (a method in disguise, run later).
 */
function isInConstruction(node: TSESTree.Node): boolean {
  const classMember = findNearestAncestorOf(
    node,
    (node) => node.type === "MethodDefinition" || node.type === "PropertyDefinition" || node.type === "AccessorProperty",
  );
  if (classMember?.type === "MethodDefinition") {
    return classMember.kind === "constructor";
  }
  if (
    classMember &&
    /* Static fields are initialized when the class is defined, not when it is instantiated */
    !classMember.static &&
    classMember.value?.type !== "ArrowFunctionExpression" &&
    classMember.value?.type !== "FunctionExpression"
  ) {
    return true;
  }
  return false;
}

/**
 * Checks if a node runs during the construction (constructor or field initializer) of a class decorated with `@Component()` imported from `@angular/core` (aliases included).
 */
export function isInAngularComponentConstructor(node: TSESTree.Node, imports: AngularClassDecoratorImports): boolean {
  /* No Angular decorator imported in this file: nothing to check */
  if (imports.size === 0) {
    return false;
  }

  return isInConstruction(node) && isInImportedAngularClass(node, imports, ["Component"]);
}
