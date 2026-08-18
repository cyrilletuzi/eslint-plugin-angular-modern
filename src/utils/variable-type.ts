import type { TSESTree } from "@typescript-eslint/utils";

/**
 * Get the type of a variable.
 */
export function getVariableType(variableDeclator: TSESTree.Node): string | undefined {
  if (
    variableDeclator.type === "VariableDeclarator" &&
    variableDeclator.id.type === "Identifier" &&
    variableDeclator.id.typeAnnotation?.typeAnnotation.type === "TSTypeReference" &&
    variableDeclator.id.typeAnnotation.typeAnnotation.typeName.type === "Identifier"
  ) {
    return variableDeclator.id.typeAnnotation.typeAnnotation.typeName.name;
  }

  return undefined;
}