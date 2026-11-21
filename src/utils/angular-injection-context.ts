import type { TSESTree } from "@typescript-eslint/utils";
import { isAngularConstructor, isAngularFieldInitialization } from "./angular-class-initialization";
import { isFactoryFunction } from "./angular-factory";
import { isFunctionTypeWithInjectionContext } from "./angular-function-type-with-injection-context";
import { isCallbackOfFunctionWithInjectionContext } from "./angular-function-with-injection-context";
import { isInjectionContextAsserted } from "./angular-injection-context-assertion";
import { isMethodWithInjectionContext } from "./angular-method-with-injection-context";
import { isRouteFunction } from "./angular-route";
import { findNearestAncestorOf, isFunction, type FunctionNode } from "./ast-traversal";
import { isAfterAwait } from "./await-detection";

type Scope = FunctionNode | TSESTree.PropertyDefinition | TSESTree.AccessorProperty | TSESTree.StaticBlock;

function isScope(node: TSESTree.Node): node is Scope {
  return isFunction(node) ||
    node.type === "PropertyDefinition" ||
    /* Auto-accessors (`accessor a = inject(A)`) are initialized at construction too */
    node.type === "AccessorProperty" ||
    node.type === "StaticBlock";
}

/**
 * Checks if a node is in an injection context.
 *
 * The injection context is only available in the code run synchronously when it is created:
 * a field initializer, or the function with injection context itself (the constructor, the guard, the factory, the `runInInjectionContext()` callback...).
 * Other calls in between are fine, like `obs.pipe(takeUntilDestroyed())` or `toUser(inject(User))`,
 * but not a nested function (callback or not), which may be run later, nor the code after an `await`.
 * So only the nearest function (or field initializer) is checked.
 */
export function isInInjectionContext(node: TSESTree.Node, {
  includeRouting = false,
  includeHttp = false,
  includeFactories = false,
  includeAsyncAppInitializationFunctions = false,
  includeSyncAppInitializationFunctions = false,
} = {}): boolean {
  const scope = findNearestAncestorOf(node, isScope);

  if (scope === undefined || scope.type === "StaticBlock") {
    return false;
  }

  // Start with field initializer and constructor, as they are by far the most common cases
  if (scope.type === "PropertyDefinition" || scope.type === "AccessorProperty") {
    return isAngularFieldInitialization(scope);
  }

  return (
    isAngularConstructor(scope) ||
    // Special contexts (guard, resolver and interceptor) are the second most common case
    // 1. modern function syntax, 2. legacy class syntax, 3. directly inline inside a route
    isFunctionTypeWithInjectionContext(scope, { includeRouting, includeHttp }) ||
    isMethodWithInjectionContext(scope, { includeRouting, includeHttp }) ||
    (includeRouting && isRouteFunction(scope)) ||
    // Factories
    (includeFactories && isFactoryFunction(scope)) ||
    // Special functions like `runInInjectionContext()` and some application providers
    isCallbackOfFunctionWithInjectionContext(scope, { includeAsyncAppInitializationFunctions, includeSyncAppInitializationFunctions }) ||
    // Custom injectable functions where context is asserted
    isInjectionContextAsserted(scope)
  ) &&
    // The injection context is lost after an `await` (assertions included, as they only cover the synchronous part)
    !isAfterAwait(node, scope);
}
