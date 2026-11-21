import { findAngularClassDecorator } from "./angular-class-decorator";
import { getKeyName, hasUnknownKey } from "./ast-property-key";
import type { FunctionNode } from "./ast-traversal";

/* Method name => interface name */
const routingMethods: ReadonlyMap<string, string> = new Map([
  ["canActivate", "CanActivate"],
  ["canActivateChild", "CanActivateChild"],
  ["canDeactivate", "CanDeactivate"],
  ["canMatch", "CanMatch"],
  ["resolve", "Resolve"],
]);

const httpMethods: ReadonlyMap<string, string> = new Map([
  ["intercept", "HttpInterceptor"],
]);

/**
 * Checks if a function is a method of a legacy class guard, resolver or interceptor:
 * `@Injectable() class SomeGuard implements CanActivate { canActivate() {} }`
 */
export function isMethodWithInjectionContext(functionNode: FunctionNode, {
  includeRouting = false,
  includeHttp = false,
} = {}): boolean {
  const methodDefinition = functionNode.parent;

  if (methodDefinition.type !== "MethodDefinition" || (!includeRouting && !includeHttp)) {
    return false;
  }

  const methodName = getKeyName(methodDefinition);
  let interfaceNames: readonly string[];

  if (methodName !== undefined) {
    const interfaceName = (includeRouting ? routingMethods.get(methodName) : undefined) ??
      (includeHttp ? httpMethods.get(methodName) : undefined);
    interfaceNames = interfaceName !== undefined ? [interfaceName] : [];
  } else if (hasUnknownKey(methodDefinition)) {
    /* The method prevents a report, so a key with an unknown value, like `[key]`, may be any method of the interfaces */
    interfaceNames = [
      ...(includeRouting ? routingMethods.values() : []),
      ...(includeHttp ? httpMethods.values() : []),
    ];
  } else {
    return false;
  }

  const classDeclaration = methodDefinition.parent.parent;

  return interfaceNames.length > 0 &&
    classDeclaration.type === "ClassDeclaration" &&
    classDeclaration.implements.some(
      ({ expression }) =>
        expression.type === "Identifier" &&
        interfaceNames.includes(expression.name),
    ) &&
    findAngularClassDecorator(classDeclaration) !== undefined;
}
