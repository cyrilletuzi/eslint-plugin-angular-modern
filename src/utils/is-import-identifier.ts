import type { TSESTree } from "@typescript-eslint/utils";

export function isImportIdentifier(node: TSESTree.Identifier): boolean {
  return node.parent.type === "ImportSpecifier";
}