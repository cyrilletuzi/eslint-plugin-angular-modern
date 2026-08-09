import { AST_NODE_TYPES, ASTUtils, type TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";

export type AngularClassDecorator = "Component" | "Directive" | "Injectable" | "NgModule" | "Pipe" | "Service";

/**
 * Checks if a `ClassDeclaration` has an Angular decorator and returns it.
 * 
 * @example
 * ```typescript
 * const classDeclaration = findNearestAncestorOf(
 *   node,
 *   (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
 * );
 *
 * if (classDeclaration && findAngularClassDecorator(classDeclaration)) {
 *   return true;
 * }
 * ```
 */
export function findAngularClassDecorator({ decorators }: TSESTree.ClassDeclaration, allowedDecorators: readonly AngularClassDecorator[] = [
  "Component", "Directive", "Injectable", "NgModule", "Pipe", "Service",
]): AngularClassDecorator | undefined {
  const angularClassDecorators: ReadonlySet<AngularClassDecorator> = new Set(allowedDecorators);

  return decorators
    ?.map(({ expression }): string | undefined => {
      if (ASTUtils.isIdentifier(expression)) {
        return expression.name;
      }

      return expression.type === AST_NODE_TYPES.CallExpression &&
        ASTUtils.isIdentifier(expression.callee)
        ? expression.callee.name
        : undefined;
    })
    .filter((item) => item !== undefined)
    .find((value): value is AngularClassDecorator => angularClassDecorators.has(value as AngularClassDecorator)
    );
};

export function isInAngularClass(node: TSESTree.Node, allowedDecorators?: readonly AngularClassDecorator[]): boolean {
  const classDeclaration = findNearestAncestorOf(
    node,
    (node) => node.type === AST_NODE_TYPES.ClassDeclaration,
  );

  if (
    classDeclaration &&
    findAngularClassDecorator(classDeclaration, allowedDecorators)
  ) {
    return true;
  }
  return false;
}