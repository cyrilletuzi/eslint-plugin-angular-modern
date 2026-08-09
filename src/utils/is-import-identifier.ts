import { AST_NODE_TYPES, type TSESTree } from "@typescript-eslint/utils";

export function isImportIdentifier(node: TSESTree.Identifier): boolean {
  return node.parent.type === AST_NODE_TYPES.ImportSpecifier;
}