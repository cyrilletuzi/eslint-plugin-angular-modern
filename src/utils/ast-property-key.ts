import type { TSESTree } from "@typescript-eslint/utils";

/**
 * Get the name of a property or method key, quoted or not: `providedIn` or `'providedIn'`.
 */
export function getKeyName(key: TSESTree.Node): string | undefined {
  if (key.type === "Identifier") {
    return key.name;
  }

  if (key.type === "Literal" && typeof key.value === "string") {
    return key.value;
  }

  return undefined;
}
