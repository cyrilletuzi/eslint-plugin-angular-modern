import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

/**
 * Find the property inside a decorator node
 */
export function getDecoratorProperty(node: TSESTree.Decorator, name: string): TSESTree.Property | undefined {
  if (node.expression.type !== AST_NODE_TYPES.CallExpression) {
    return undefined;
  }

  const config = node.expression.arguments[0];

  if (
    !config ||
    config.type !== AST_NODE_TYPES.ObjectExpression
  ) {
    return undefined;
  }

  const matchedProperty = config.properties.find(
    (property) =>
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === name,
  );

  if (matchedProperty?.type === AST_NODE_TYPES.Property) {
    return matchedProperty;
  }

  return undefined;

}