import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";
import { isAfterAwait } from "./await-detection";

export function isInFunctionWithInjectionContext(node: TSESTree.Node, {
  includeAsyncAppInitializationFunctions = false,
  includeSyncAppInitializationFunctions = false,
} = {}): boolean {
  const functionsWithInjectionContext: ReadonlySet<string> = new Set([
    // see https://angular.dev/api/core/runInInjectionContext
    "runInInjectionContext",
    ...(includeAsyncAppInitializationFunctions ? [
      // see https://angular.dev/api/core/provideAppInitializer
      "provideAppInitializer",
    ] : []),
    ...(includeSyncAppInitializationFunctions ? [
      // see https://angular.dev/api/core/providePlatformInitializer
      "providePlatformInitializer",
      // see https://angular.dev/api/core/provideEnvironmentInitializer
      "provideEnvironmentInitializer",
      // see https://angular.dev/api/router/withViewTransitions
      "withViewTransitions",
      // see https://next.angular.dev/api/core/provideWebMcpTools
      "provideWebMcpTools",
    ] : []),
  ]);

  const callExpression = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.CallExpression,
  );

  if (
    callExpression?.callee.type === AST_NODE_TYPES.Identifier &&
    functionsWithInjectionContext.has(callExpression.callee.name) &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  if (callExpression?.callee.type === AST_NODE_TYPES.MemberExpression) {
    const staticFunctionsWithInjectionContext: ReadonlyMap<string, string> = new Map([
      // see https://angular.dev/api/core/testing/TestBed#runInInjectionContext
      ["TestBed", "runInInjectionContext"],
    ]);

    for (const [className, functionName] of staticFunctionsWithInjectionContext) {
      if (
        callExpression.callee.object.type === AST_NODE_TYPES.Identifier &&
        callExpression.callee.object.name === className &&
        callExpression.callee.property.type === AST_NODE_TYPES.Identifier &&
        callExpression.callee.property.name === functionName &&
        !isAfterAwait(node)
      ) {
        return true;
      }
    }
  }

  return false;
}