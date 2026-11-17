import type { TSESTree } from "@typescript-eslint/utils";

/**
 * Get the nearest ancestor node of a certain type.
 * 
 * @example
 * ```typescript
 * const classDeclaration = getNearestNodeFrom(
 *   node,
 *   (node) => node.type === "ClassDeclaration",
 * );
 * ```
 * 
 * With `notInCallback` option enabled, the traversal will stop if it encounters a `CallExpression`.
 * This is needed for some rules because the injection context is lost when inside a callback.
 * 
 * @example
 * ```typescript
 * const classDeclaration = getNearestNodeFrom(
 *   node,
 *   (node) => node.type === "ClassDeclaration",
 *   { notInCallback: true },
 * );
 * ```
 */
export function findNearestAncestorOf<T extends TSESTree.Node>(
  { parent }: TSESTree.Node,
  predicate: (parent: TSESTree.Node) => parent is T,
  { notInCallback = false } = {},
): T | undefined {
  while (parent && parent.type !== "Program") {
    if (notInCallback && (parent.type === "ArrowFunctionExpression" || parent.type === "FunctionExpression") && parent.parent.type === "CallExpression") {
      return undefined;
    }

    if (predicate(parent)) {
      return parent;
    }

    parent = parent.parent;
  }

  return undefined;
}