import type { TSESTree } from "@typescript-eslint/utils";
import { getKeyName } from "./ast-property-key";

/**
 * Find the property inside a decorator node
 */
export function getDecoratorProperty(node: TSESTree.Decorator, name: string): TSESTree.Property | undefined {
  if (node.expression.type !== "CallExpression") {
    return undefined;
  }

  const config = node.expression.arguments[0];

  if (
    !config ||
    config.type !== "ObjectExpression"
  ) {
    return undefined;
  }

  const matchedProperty = config.properties.find(
    (property) =>
      property.type === "Property" &&
      getKeyName(property.key) === name,
  );

  if (matchedProperty?.type === "Property") {
    return matchedProperty;
  }

  return undefined;

}