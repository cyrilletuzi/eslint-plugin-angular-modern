import type { FunctionNode } from "./ast-traversal";
import { getVariableType } from "./variable-type";

const routingFunctionTypes: ReadonlySet<string> = new Set([
  // see https://angular.dev/api/router/CanActivateFn
  "CanActivateFn",
  "CanActivateChildFn",
  "CanDeactivateFn",
  "CanMatchFn",
  "ResolveFn",
  // see https://github.com/angular/angular/pull/64938
  "RunGuardsAndResolvers",
  // see https://github.com/angular/angular/pull/62133
  "LoadChildren",
  "LoadChildrenCallback",
]);

// see https://angular.dev/api/common/http/HttpInterceptorFn
const httpFunctionType = "HttpInterceptorFn";

/**
 * Checks if a function is typed with a function type with injection context:
 * `const someGuard: CanActivateFn = () => {}`
 */
export function isFunctionTypeWithInjectionContext(functionNode: FunctionNode, {
  includeRouting = false,
  includeHttp = false,
} = {}): boolean {
  const { parent } = functionNode;

  if (parent.type !== "VariableDeclarator" || parent.init !== functionNode) {
    return false;
  }

  const variableType = getVariableType(parent);

  return variableType !== undefined && (
    (includeRouting && routingFunctionTypes.has(variableType)) ||
    (includeHttp && variableType === httpFunctionType)
  );
}
