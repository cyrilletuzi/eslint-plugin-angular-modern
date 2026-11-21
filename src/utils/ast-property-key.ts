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
