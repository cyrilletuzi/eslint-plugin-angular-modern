import type { FunctionNode } from "./ast-traversal";
import { getVariableType } from "./variable-type";

// see https://angular.dev/api/core/runInInjectionContext
const functionWithInjectionContext = "runInInjectionContext";

const asyncAppInitializationFunctions: ReadonlySet<string> = new Set([
  // see https://angular.dev/api/core/provideAppInitializer
  "provideAppInitializer",
]);

const syncAppInitializationFunctions: ReadonlySet<string> = new Set([
  // see https://angular.dev/api/core/providePlatformInitializer
  "providePlatformInitializer",
  // see https://angular.dev/api/core/provideEnvironmentInitializer
  "provideEnvironmentInitializer",
  // see https://next.angular.dev/api/core/provideWebMcpTools
  "provideWebMcpTools",
]);

/**
 * Checks if a function is in the view transitions options (its only function is `onViewTransitionCreated`):
 * - `withViewTransitions({ onViewTransitionCreated: () => {} })`
 * - `const options: ViewTransitionsFeatureOptions = { onViewTransitionCreated: () => {} }`
 */
function isViewTransitionsOption(functionNode: FunctionNode): boolean {
  const property = functionNode.parent;

  if (property.type !== "Property" || property.value !== functionNode) {
    return false;
  }

  const optionsParent = property.parent.parent;

  return (
    // see https://angular.dev/api/router/withViewTransitions
    optionsParent?.type === "CallExpression" &&
    optionsParent.callee.type === "Identifier" &&
    optionsParent.callee.name === "withViewTransitions"
  ) || (
    // see https://angular.dev/api/router/ViewTransitionsFeatureOptions#onViewTransitionCreated
    optionsParent !== undefined &&
    getVariableType(optionsParent) === "ViewTransitionsFeatureOptions"
  );
}

/**
 * Checks if a function is run in an injection context by Angular:
 * - `runInInjectionContext(injector, () => {})`
 * - `TestBed.runInInjectionContext(() => {})`
 * - `injector.runInContext(() => {})`
 * - `provideAppInitializer(() => {})`
 * - `withViewTransitions({ onViewTransitionCreated: () => {} })`
 */
export function isCallbackOfFunctionWithInjectionContext(functionNode: FunctionNode, {
  includeAsyncAppInitializationFunctions = false,
  includeSyncAppInitializationFunctions = false,
} = {}): boolean {
  const { parent } = functionNode;

  if (parent.type === "CallExpression") {
    const { callee } = parent;

    if (callee.type === "Identifier") {
      return callee.name === functionWithInjectionContext ||
        (includeAsyncAppInitializationFunctions && asyncAppInitializationFunctions.has(callee.name)) ||
        (includeSyncAppInitializationFunctions && syncAppInitializationFunctions.has(callee.name));
    }

    // Methods: name-based whatever the object (an instance can be in any variable), as it only skips reports
    return callee.type === "MemberExpression" &&
      callee.property.type === "Identifier" &&
      (
        // see https://angular.dev/api/core/testing/TestBed#runInInjectionContext (static and instance from `getTestBed()`)
        callee.property.name === "runInInjectionContext" ||
        // see https://angular.dev/api/core/EnvironmentInjector#runInContext
        callee.property.name === "runInContext"
      );
  }

  return includeSyncAppInitializationFunctions && isViewTransitionsOption(functionNode);
}
