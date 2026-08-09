import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";
import { findAngularClassDecorator } from "./angular-class-decorator";
import { findNearestAncestorOf } from "./ast-traversal";
import { isAfterAwait } from "./await-detection";

export function isInMethodWithInjectionContext(node: TSESTree.Node, {
  includeRouting = false,
  includeHttp = false,
} = {}): boolean {
  const routingMethodsAndInterfaces: readonly (readonly [string, string])[] = [
    ["canActivate", "CanActivate"],
    ["canActivateChild", "CanActivateChild"],
    ["canDeactivate", "CanDeactivate"],
    ["canMatch", "CanMatch"],
    ["resolve", "Resolve"],
  ];
  const httpMethodsAndInterfaces: readonly (readonly [string, string])[] = [
    ["intercept", "HttpInterceptor"],
  ];
  const methodsAndInterfacesWithInjectionContextMap: ReadonlyMap<string, string> =
    new Map<string, string>([
      ...(includeRouting ? routingMethodsAndInterfaces : []),
      ...(includeHttp ? httpMethodsAndInterfaces : []),
    ]);

  if (methodsAndInterfacesWithInjectionContextMap.size === 0) {
    return false;
  }

  const methodsWithInjectionContext: ReadonlySet<string> = new Set(
    methodsAndInterfacesWithInjectionContextMap.keys(),
  );

  // Check if the method name is one of the accepted ones like `canActivate`
  const methodDefinition = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.MethodDefinition,
    { notInCallback: true },
  );

  if (
    methodDefinition?.key.type !== AST_NODE_TYPES.Identifier ||
    !methodsWithInjectionContext.has(methodDefinition.key.name)
  ) {
    return false;
  }

  // Check if we are in an injectable Angular class
  const classDeclaration = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
  );

  if (
    !classDeclaration ||
    !findAngularClassDecorator(classDeclaration)
  ) {
    return false;
  }

  // Check if the class implements the according accepted interface
  const implementName = methodsAndInterfacesWithInjectionContextMap.get(
    methodDefinition.key.name,
  );

  if (
    implementName !== undefined &&
    classDeclaration.implements.find(
      ({ expression }) =>
        expression.type === AST_NODE_TYPES.Identifier &&
        expression.name === implementName,
    ) !== undefined &&
    !isAfterAwait(node)
  ) {
    return true;
  }

  return false;
}