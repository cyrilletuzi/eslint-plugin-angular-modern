import type { TSESTree } from "@typescript-eslint/utils";

export function isCalledWithProperty(node: TSESTree.CallExpression, argumentPosition: number, propertyName: string): boolean {
  const argument = node.arguments.at(argumentPosition);

  if ((argument?.type === "ObjectExpression" &&
    argument.properties.find((property) =>
      property.type === "Property" &&
      property.key.type === "Identifier" &&
      property.key.name === propertyName
    )) || argument?.type === "Identifier"
  ) {
    return true;
  }
  return false;
}