import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export function isCalledWithProperty(node: TSESTree.CallExpression, argumentPosition: number, propertyName: string): boolean {
  const argument = node.arguments.at(argumentPosition);

  if ((argument?.type === AST_NODE_TYPES.ObjectExpression &&
    argument.properties.find((property) =>
      property.type === AST_NODE_TYPES.Property &&
      property.key.type === AST_NODE_TYPES.Identifier &&
      property.key.name === propertyName
    )) || argument?.type === AST_NODE_TYPES.Identifier
  ) {
    return true;
  }
  return false;
}