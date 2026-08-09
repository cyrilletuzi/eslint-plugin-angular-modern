import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Get the nearest ancestor node of a certain type.
 * 
 * @example
 * ```typescript
 * const classDeclaration = getNearestNodeFrom(
 *   node,
 *   (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
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
 *   (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
 *   { notInCallback: true },
 * );
 * ```
 */
export function findNearestAncestorOf<T extends TSESTree.Node>(
  { parent }: TSESTree.Node,
  predicate: (parent: TSESTree.Node) => parent is T,
  { notInCallback = false } = {},
): T | undefined {
  while (parent && parent.type !== AST_NODE_TYPES.Program) {
    if (notInCallback && (parent.type === AST_NODE_TYPES.ArrowFunctionExpression || parent.type === AST_NODE_TYPES.FunctionExpression) && parent.parent.type === AST_NODE_TYPES.CallExpression) {
      return undefined;
    }

    if (predicate(parent)) {
      return parent;
    }

    parent = parent.parent;
  }

  return undefined;
}