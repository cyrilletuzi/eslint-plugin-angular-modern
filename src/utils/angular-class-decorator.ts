import type { TSESTree } from "@typescript-eslint/utils";
import { findNearestAncestorOf } from "./ast-traversal";

export type AngularClassDecorator = "Component" | "Directive" | "Injectable" | "NgModule" | "Pipe" | "Service";

const allAngularClassDecorators: readonly AngularClassDecorator[] = ["Component", "Service", "Pipe", "Directive", "Injectable", "NgModule"];

/**
 * Checks if a `ClassDeclaration` has an Angular decorator and returns it.
 * 
 * @example
 * ```typescript
 * const classDeclaration = findNearestAncestorOf(
 *   node,
 *   (node) => node.type === "ClassDeclaration",
 * );
 *
 * if (classDeclaration && findAngularClassDecorator(classDeclaration)) {
 *   return true;
 * }
 * ```
 */
export function findAngularClassDecorator({ decorators }: TSESTree.ClassDeclaration, allowedDecorators: readonly AngularClassDecorator[] = allAngularClassDecorators): AngularClassDecorator | undefined {
  /* Plain loop without intermediate arrays or sets, as it is called on hot paths (like each `inject()` call) */
  for (const { expression } of decorators ?? []) {
    /* `@Component()` or `@Component` */
    const callee = expression.type === "CallExpression" ? expression.callee : expression;

    if (callee.type === "Identifier" && (allowedDecorators as readonly string[]).includes(callee.name)) {
      return callee.name as AngularClassDecorator;
    }
  }

  return undefined;
};

export function isInAngularClass(node: TSESTree.Node, allowedDecorators?: readonly AngularClassDecorator[]): boolean {
  const classDeclaration = findNearestAncestorOf(
    node,
    (node) => node.type === "ClassDeclaration",
  );

  if (
    classDeclaration &&
    findAngularClassDecorator(classDeclaration, allowedDecorators)
  ) {
    return true;
  }
  return false;
}

/**
 * Angular class decorators imported from `@angular/core` in the current file, by local name (aliases included).
 * Filled by a listener on `angularClassDecoratorImportSelector`, with `addAngularClassDecoratorImport()`.
 */
export type AngularClassDecoratorImports = Map<string, AngularClassDecorator>;

/**
 * Selector of the Angular class decorators imports, to be used with `addAngularClassDecoratorImport()`.
 * Imports are visited before the classes, so the map is complete when classes are checked.
 */
export const angularClassDecoratorImportSelector = "ImportDeclaration[source.value='@angular/core'] > ImportSpecifier[imported.name=/^(Component|Directive|Injectable|NgModule|Pipe|Service)$/]";

export function addAngularClassDecoratorImport(imports: AngularClassDecoratorImports, node: TSESTree.ImportSpecifier): void {
  imports.set(node.local.name, (node.imported as TSESTree.Identifier).name as AngularClassDecorator);
}

/**
 * Checks if a node is inside a class with an Angular decorator imported from `@angular/core` (aliases included).
 * Unlike `isInAngularClass()`, same-named decorators from other libraries (like NestJS `@Injectable()`) are ignored.
 */
export function isInImportedAngularClass(node: TSESTree.Node, imports: AngularClassDecoratorImports, allowedDecorators: readonly AngularClassDecorator[]): boolean {
  /* No Angular decorator imported in this file: nothing to check */
  if (imports.size === 0) {
    return false;
  }

  const classDeclaration = findNearestAncestorOf(
    node,
    (node) => node.type === "ClassDeclaration",
  );

  return classDeclaration?.decorators.some(({ expression }) => {
    const callee = expression.type === "CallExpression" ? expression.callee : expression;
    const angularDecorator = callee.type === "Identifier" ? imports.get(callee.name) : undefined;
    return angularDecorator !== undefined && allowedDecorators.includes(angularDecorator);
  }) ?? false;
}
