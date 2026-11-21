import type { TSESTree } from "@typescript-eslint/utils";

/**
 * Get the name of a property or method key, quoted or not: `providedIn`, `'providedIn'` or `['providedIn']`.
 * A computed key with a variable, like `[providedIn]`, is not the `providedIn` property, so it has no name.
 */
export function getKeyName({ key, computed }: { key: TSESTree.Node; computed: boolean }): string | undefined {
  /* `[provide]` is a variable, not the `provide` property */
  if (key.type === "Identifier" && !computed) {
    return key.name;
  }

  /* `'provide'` or `['provide']` */
  if (key.type === "Literal" && typeof key.value === "string") {
    return key.value;
  }

  return undefined;
}

/**
 * Checks if a property or method key is computed with an unknown value, like `[key]`, which may be any name.
 */
export function hasUnknownKey({ key, computed }: { key: TSESTree.Node; computed: boolean }): boolean {
  return computed && key.type !== "Literal";
}

/**
 * Checks if a property or method may have a name: the name itself, or a key with an unknown value, like `[key]`.
 * To be used only for checks which prevent a report, so an unknown key results in a false negative instead of a false positive.
 * Checks which trigger a report must use `getKeyName()` instead, for the same reason.
 */
export function mayHaveKeyName(node: { key: TSESTree.Node; computed: boolean }, name: string): boolean {
  return getKeyName(node) === name || hasUnknownKey(node);
}
