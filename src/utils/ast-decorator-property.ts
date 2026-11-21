import type { TSESTree } from "@typescript-eslint/utils";
import { getKeyName } from "./ast-property-key";

/**
 * Get the options object of a decorator: `@Component({})`
 */
export function getDecoratorOptions(node: TSESTree.Decorator): TSESTree.ObjectExpression | undefined {
  if (node.expression.type !== "CallExpression") {
    return undefined;
  }

  const config = node.expression.arguments[0];

  return config?.type === "ObjectExpression" ? config : undefined;
}

/**
 * Find the property inside a decorator node
 */
export function getDecoratorProperty(node: TSESTree.Decorator, name: string): TSESTree.Property | undefined {
  const matchedProperty = getDecoratorOptions(node)?.properties.find(
    (property) =>
      property.type === "Property" &&
      getKeyName(property) === name,
  );

  if (matchedProperty?.type === "Property") {
    return matchedProperty;
  }

  return undefined;
}
