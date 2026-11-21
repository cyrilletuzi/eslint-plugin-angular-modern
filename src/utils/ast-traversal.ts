import type { TSESTree } from "@typescript-eslint/utils";

export type FunctionNode = TSESTree.ArrowFunctionExpression | TSESTree.FunctionExpression | TSESTree.FunctionDeclaration;

export function isFunction(node: TSESTree.Node): node is FunctionNode {
  return node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression" || node.type === "FunctionDeclaration";
}

/**
 * Get the nearest ancestor node matching a predicate.
 *
 * @example
 * ```typescript
 * const classDeclaration = findNearestAncestorOf(
 *   node,
 *   (node) => node.type === "ClassDeclaration",
 * );
 * ```
 */
export function findNearestAncestorOf<T extends TSESTree.Node>(
  { parent }: TSESTree.Node,
  predicate: (parent: TSESTree.Node) => parent is T,
): T | undefined {
  while (parent && parent.type !== "Program") {
    if (predicate(parent)) {
      return parent;
    }

    parent = parent.parent;
  }

  return undefined;
}
