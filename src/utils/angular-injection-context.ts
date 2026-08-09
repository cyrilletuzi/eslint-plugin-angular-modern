import type { TSESTree } from "@typescript-eslint/utils";
import { isInAngularClassInitialization } from "./angular-class-initialization";
import { isInFactoryFunction } from "./angular-factory";
import { isInFunctionTypeWithInjectionContext } from "./angular-function-type-with-injection-context";
import { isInFunctionWithInjectionContext } from "./angular-function-with-injection-context";
import { isInjectionContextAsserted } from "./angular-injection-context-assertion";
import { isInMethodWithInjectionContext } from "./angular-method-with-injection-context";
import { isInRoute } from "./angular-route";

export function isInInjectionContext(node: TSESTree.Node, {
  includeRouting = false,
  includeHttp = false,
  includeFactories = false,
  includeAsyncAppInitializationFunctions = false,
  includeSyncAppInitializationFunctions = false,
} = {}): boolean {
  if (
    // Start with constructor and field initializer, as they are by far the most common case, to avoid useless checks
    (isInAngularClassInitialization(node) ||
      // Special contexts (guard, resolver and interceptor) are the second most common case
      // 1. modern function syntax, 2. legacy class syntax, 3. directly inline inside a route
      isInFunctionTypeWithInjectionContext(node, { includeRouting, includeHttp, includeSyncAppInitializationFunctions }) ||
      isInMethodWithInjectionContext(node, { includeRouting, includeHttp }) ||
      (includeRouting && isInRoute(node)) ||
      // Factories
      (includeFactories && isInFactoryFunction(node)) ||
      // Special functions like `runInInjectionContext` and some application providers
      isInFunctionWithInjectionContext(node, { includeAsyncAppInitializationFunctions, includeSyncAppInitializationFunctions }) ||
      // Custom injectable functions where context is asserted
      isInjectionContextAsserted(node))
  ) {
    return true;
  }

  return false;
}