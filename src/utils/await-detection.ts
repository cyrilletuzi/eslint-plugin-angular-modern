import type { TSESTree } from "@typescript-eslint/utils";
import { isFunction, type FunctionNode } from "./ast-traversal";

/**
 * Checks if there is an `await` which ends before a position, in a node and its children.
 * `await` in nested functions are ignored, as they do not pause the current function.
 */
function hasAwaitBefore(node: TSESTree.Node, position: number): boolean {
  /* Only code before the position is relevant */
  if (node.range[0] >= position || isFunction(node)) {
    return false;
  }

  /* `await something()` before, but not an `await` containing the node, like `await something(inject(Some))` */
  if (node.type === "AwaitExpression" && node.range[1] <= position) {
    return true;
  }

  /* `for await (const item of items) {}`: paused before each iteration */
  if (node.type === "ForOfStatement" && node.await && node.right.range[1] <= position) {
    return true;
  }

  for (const key in node) {
    if (key === "parent" || key === "range" || key === "loc") {
      continue;
    }

    const value: unknown = node[key as keyof typeof node];

    if (Array.isArray(value)) {
      for (const child of value) {
        if (isNode(child) && hasAwaitBefore(child, position)) {
          return true;
        }
      }
    } else if (isNode(value) && hasAwaitBefore(value, position)) {
      return true;
    }
  }

  return false;
}

function isNode(value: unknown): value is TSESTree.Node {
  return typeof value === "object" && value !== null && typeof (value as { type?: unknown }).type === "string";
}

/**
 * Checks if a node is after an `await` in a function, as the injection context is lost after the first `await`.
 * Any `await` before is detected, like `await something();`, `const result = await something();`,
 * `if (await something()) {}` or `for await`.
 */
export function isAfterAwait(node: TSESTree.Node, functionNode: FunctionNode): boolean {
  /* `await` is only possible in async functions, which are rare: no traversal for the others */
  return functionNode.async && hasAwaitBefore(functionNode.body, node.range[0]);
}
