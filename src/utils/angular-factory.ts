import type { TSESTree } from "@typescript-eslint/utils";
import { getKeyName, hasUnknownKey, mayHaveKeyName } from "./ast-property-key";
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
  /* A factory prevents a report, so a key with an unknown value, like `[key]`, may be `useFactory` or `factory` */
  const isUnknownKey = hasUnknownKey(property);

  if (keyName === "useFactory" || isUnknownKey) {
    if (objectExpression.properties.some(
      (objectProperty) =>
        objectProperty.type === "Property" &&
        objectProperty !== property &&
        mayHaveKeyName(objectProperty, "provide"),
    ) || isDecoratorOptions(objectExpression, "Injectable")) {
      return true;
    }
  }

  if (keyName === "factory" || isUnknownKey) {
    const newExpression = objectExpression.parent;

    return (
      newExpression.type === "NewExpression" &&
      newExpression.callee.type === "Identifier" &&
      newExpression.callee.name === "InjectionToken"
    ) || isDecoratorOptions(objectExpression, "Service");
  }

  return false;
}
