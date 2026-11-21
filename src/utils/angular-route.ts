import type { TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf, isFunction, type FunctionNode } from "./ast-traversal";
import { getVariableType } from "./variable-type";

const routeTypes: ReadonlySet<string> = new Set(["Routes", "Route"]);

/**
 * Checks if a function is directly inside a variable typed as `Routes` or `Route`:
 * `const routes: Routes = [{ path: '', canActivate: [() => {}] }]`
 */
export function isRouteFunction(functionNode: FunctionNode): boolean {
  /* Stop at a function or a call in between: the function is a callback, not the route function itself */
  const ancestor = findNearestAncestorOf(
    functionNode,
    (node): node is TSESTree.Node =>
      node.type === "VariableDeclarator" ||
      node.type === "CallExpression" ||
      node.type === "NewExpression" ||
      isFunction(node),
  );

  const variableType = ancestor?.type === "VariableDeclarator" ? getVariableType(ancestor) : undefined;

  return variableType !== undefined && routeTypes.has(variableType);
}
