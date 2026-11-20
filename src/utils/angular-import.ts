import type { RuleDefinition } from "@eslint/core";
import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

type RuleContext = Parameters<RuleDefinition["create"]>[0];

/**
 * Get the usages of an import (aliases included), in values and in types, excluding the import itself.
 * To be used from an `ImportSpecifier` listener, so the import source is checked, but errors are still reported at usage sites.
 */
export function getImportedReferences(context: RuleContext, node: TSESTree.ImportSpecifier): TSESTree.Identifier[] {
  const references: TSESTree.Identifier[] = [];

  // Legit cast because ESLint can lint any file, but we know here it is TypeScript code
  for (const variable of (context.sourceCode as unknown as TSESLint.SourceCode).getDeclaredVariables(node)) {
    for (const { identifier } of variable.references) {
      if (identifier.type === "Identifier") {
        references.push(identifier);
      }
    }
  }

  return references;
}

/**
 * Get the calls of an imported function (aliases included).
 * To be used from an `ImportSpecifier` listener, so the import source is checked, but errors are still reported at call sites.
 */
export function getImportedFunctionCalls(context: RuleContext, node: TSESTree.ImportSpecifier): TSESTree.CallExpression[] {
  const calls: TSESTree.CallExpression[] = [];

  for (const identifier of getImportedReferences(context, node)) {
    const parent = identifier.parent;
    if (parent.type === "CallExpression" && parent.callee === identifier) {
      calls.push(parent);
    }
  }

  return calls;
}

/**
 * Get the decorators using an imported decorator function (aliases included), like `@Component()`.
 * To be used from an `ImportSpecifier` listener, so the import source is checked, but errors are still reported at decorator sites.
 */
export function getImportedDecorators(context: RuleContext, node: TSESTree.ImportSpecifier): TSESTree.Decorator[] {
  const decorators: TSESTree.Decorator[] = [];

  for (const call of getImportedFunctionCalls(context, node)) {
    if (call.parent.type === "Decorator") {
      decorators.push(call.parent);
    }
  }

  return decorators;
}
