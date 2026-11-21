import type { TSESTree } from "@typescript-eslint/utils";
import type { FunctionNode } from "./ast-traversal";

function isAssertCall(statement: TSESTree.Statement): boolean {
  return statement.type === "ExpressionStatement" &&
    statement.expression.type === "CallExpression" &&
    statement.expression.callee.type === "Identifier" &&
    statement.expression.callee.name === "assertInInjectionContext";
}

/**
 * Checks if a function asserts it is called in an injection context:
 * - `function injectSome() { assertInInjectionContext(injectSome); }`
 * - `function injectSome(injector) { if (!injector) { assertInInjectionContext(injectSome); } }`
 *
 * The assertion declares that the function must be called in an injection context, wherever it is placed in the function.
 */
export function isInjectionContextAsserted(functionNode: FunctionNode): boolean {
  return functionNode.body.type === "BlockStatement" && functionNode.body.body.some(
    (statement) =>
      isAssertCall(statement) ||
      (statement.type === "IfStatement" &&
        statement.consequent.type === "BlockStatement" &&
        statement.consequent.body.some(isAssertCall)),
  );
}
