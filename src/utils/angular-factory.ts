import type { TSESTree } from "@typescript-eslint/utils";
import { getKeyName } from "./ast-property-key";
import type { FunctionNode } from "./ast-traversal";

/**
 * Checks if an object is the options of a decorator: `@Injectable({})`.
 */
function isDecoratorOptions(objectExpression: TSESTree.ObjectExpression, decoratorName: string): boolean {
  const callExpression = objectExpression.parent;

  return callExpression.type === "CallExpression" &&
    callExpression.parent.type === "Decorator" &&
    callExpression.callee.type === "Identifier" &&
    callExpression.callee.name === decoratorName;
}

/**
 * Checks if a function is a factory:
 * - `{ provide: Some, useFactory: () => {} }`
 * - `new InjectionToken('some', { factory: () => {} })`
 * - `@Injectable({ useFactory: () => {} })`
 * - `@Service({ factory: () => {} })`
 */
export function isFactoryFunction(functionNode: FunctionNode): boolean {
  const property = functionNode.parent;

  if (property.type !== "Property" || property.value !== functionNode || property.parent.type !== "ObjectExpression") {
    return false;
  }

  const objectExpression = property.parent;
  const keyName = getKeyName(property);

  if (keyName === "useFactory") {
    return objectExpression.properties.some(
      (objectProperty) =>
        objectProperty.type === "Property" &&
        getKeyName(objectProperty) === "provide",
    ) || isDecoratorOptions(objectExpression, "Injectable");
  }

  if (keyName === "factory") {
    const newExpression = objectExpression.parent;

    return (
      newExpression.type === "NewExpression" &&
      newExpression.callee.type === "Identifier" &&
      newExpression.callee.name === "InjectionToken"
    ) || isDecoratorOptions(objectExpression, "Service");
  }

  return false;
}
