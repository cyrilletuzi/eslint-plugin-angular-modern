import type { RuleDefinition } from "@eslint/core";
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";
import { mayHaveKeyName } from "./ast-property-key";

type RuleContext = Parameters<RuleDefinition["create"]>[0];

/**
 * Resolve a variable to its object literal, only if it is a `const` initialized with an object literal,
 * like `const options = { injector };`, as it cannot be reassigned.
 */
function resolveConstObject(context: RuleContext, identifier: TSESTree.Identifier): TSESTree.ObjectExpression | undefined {
  // Legit cast because ESLint can lint any file, but we know here it is TypeScript code
  const scope = (context.sourceCode as unknown as TSESLint.SourceCode).getScope(identifier);
  const variable = scope.references.find((reference) => reference.identifier === identifier)?.resolved;
  const definition = variable?.defs.length === 1 ? variable.defs[0] : undefined;

  if (
    definition?.type === "Variable" &&
    definition.parent.kind === "const" &&
    definition.node.id.type === "Identifier" &&
    definition.node.init?.type === "ObjectExpression"
  ) {
    return definition.node.init;
  }

  return undefined;
}

/**
 * Get the object passed as an argument, inline like `fn({ injector })`,
 * or in a local `const`, like `const options = { injector }; fn(options);`.
 * Returns `null` if the argument is a variable which cannot be resolved,
 * and `undefined` if the argument is missing or is something else.
 */
export function getObjectArgument(context: RuleContext, node: TSESTree.CallExpression, argumentPosition: number): TSESTree.ObjectExpression | null | undefined {
  const argument = node.arguments.at(argumentPosition);

  if (argument?.type === "ObjectExpression") {
    return argument;
  }

  if (argument?.type === "Identifier") {
    return resolveConstObject(context, argument) ?? null;
  }

  return undefined;
}

export function isCalledWithProperty(context: RuleContext, node: TSESTree.CallExpression, argumentPosition: number, propertyName: string): boolean {
  const object = getObjectArgument(context, node, argumentPosition);

  /* Options in a variable which cannot be resolved (parameter, import, `let`...) are supposed to contain the property */
  if (object === null) {
    return true;
  }

  /* The property prevents a report, so a key with an unknown value, like `[key]`, may be the property */
  return object?.properties.some((property) =>
    property.type === "Property" &&
    mayHaveKeyName(property, propertyName)
  ) ?? false;
}
