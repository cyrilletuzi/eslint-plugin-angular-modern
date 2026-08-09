import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";
import { isAfterAwait } from "./await-detection";

export function isInFunctionTypeWithInjectionContext(node: TSESTree.Node, {
  includeRouting = false,
  includeHttp = false,
  includeSyncAppInitializationFunctions = false,
} = {}): boolean {
  const functionTypesWithInjectionContext: ReadonlySet<string> = new Set([
    ...(includeRouting ? [
      // see https://angular.dev/api/router/ViewTransitionsFeatureOptions#onViewTransitionCreated
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
    ] : []),
    ...(includeHttp ? [
      // see https://angular.dev/api/router/ViewTransitionsFeatureOptions#onViewTransitionCreated
      "HttpInterceptorFn",
    ] : []),
    ...(includeSyncAppInitializationFunctions ? [
      // see https://angular.dev/api/router/ViewTransitionsFeatureOptions#onViewTransitionCreated
      "ViewTransitionsFeatureOptions",
    ] : []),
  ]);

  if (functionTypesWithInjectionContext.size === 0) {
    return false;
  }

  if (!node.parent) {
    return false;
  }
  // Check the variable type is an accepted type like `CanActivateFn`
  // `inject()` can be stored in a variable itself, so start at the parent for the lookup,
  // otherwise it would catch the first variable
  const variableDeclarator = findNearestAncestorOf(
    node.parent,
    (node) => node.type === AST_NODE_TYPES.VariableDeclarator,
    { notInCallback: true },
  );

  const typeAnnotation = variableDeclarator?.id.typeAnnotation?.typeAnnotation;

  if (
    typeAnnotation?.type === AST_NODE_TYPES.TSTypeReference &&
    typeAnnotation.typeName.type === AST_NODE_TYPES.Identifier &&
    functionTypesWithInjectionContext.has(typeAnnotation.typeName.name) &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  return false;
}