import type { TSESTree } from "@typescript-eslint/utils";
import { isInImportedAngularClass, type AngularClassDecoratorImports } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";

function isInConstructor(node: TSESTree.Node): boolean {
  const methodDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === "MethodDefinition",
  );
  if (methodDefinition?.kind === "constructor") {
    return true;
  }
  return false;
}

/**
 * Checks if a node is inside the constructor of a class decorated with `@Component()` imported from `@angular/core` (aliases included).
 */
export function isInAngularComponentConstructor(node: TSESTree.Node, imports: AngularClassDecoratorImports): boolean {
  /* No Angular decorator imported in this file: nothing to check */
  if (imports.size === 0) {
    return false;
  }

  return isInConstructor(node) && isInImportedAngularClass(node, imports, ["Component"]);
}
