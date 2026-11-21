import type { TSESTree } from "@typescript-eslint/utils";
import { getKeyName } from "./ast-property-key";

export function isCalledWithProperty(node: TSESTree.CallExpression, argumentPosition: number, propertyName: string): boolean {
  const argument = node.arguments.at(argumentPosition);

  if ((argument?.type === "ObjectExpression" &&
    argument.properties.find((property) =>
      property.type === "Property" &&
      getKeyName(property.key) === propertyName
    )) || argument?.type === "Identifier"
  ) {
    return true;
  }
  return false;
}