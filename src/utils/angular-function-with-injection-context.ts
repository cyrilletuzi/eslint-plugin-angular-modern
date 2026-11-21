import type { TSESTree } from "@typescript-eslint/utils";
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
    (node) => node.type === "CallExpression",
  );

  if (
    callExpression?.callee.type === "Identifier" &&
    functionsWithInjectionContext.has(callExpression.callee.name) &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  // Methods: name-based whatever the object (an instance can be in any variable), as it only skips reports
  if (
    callExpression?.callee.type === "MemberExpression" &&
    callExpression.callee.property.type === "Identifier" &&
    (
      // see https://angular.dev/api/core/testing/TestBed#runInInjectionContext (static and instance from `getTestBed()`)
      callExpression.callee.property.name === "runInInjectionContext" ||
      // see https://angular.dev/api/core/EnvironmentInjector#runInContext
      callExpression.callee.property.name === "runInContext"
    ) &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  return false;
}