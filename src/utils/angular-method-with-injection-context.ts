import { findAngularClassDecorator } from "./angular-class-decorator";
import { getKeyName } from "./ast-property-key";
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

  if (methodName === undefined) {
    return false;
  }

  const interfaceName = (includeRouting ? routingMethods.get(methodName) : undefined) ??
    (includeHttp ? httpMethods.get(methodName) : undefined);

  const classDeclaration = methodDefinition.parent.parent;

  return interfaceName !== undefined &&
    classDeclaration.type === "ClassDeclaration" &&
    classDeclaration.implements.some(
      ({ expression }) =>
        expression.type === "Identifier" &&
        expression.name === interfaceName,
    ) &&
    findAngularClassDecorator(classDeclaration) !== undefined;
}
