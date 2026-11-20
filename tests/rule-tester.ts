import type { RuleDefinition } from "@eslint/core";
import { RuleTester, type Rule } from "eslint";
import { parser } from "typescript-eslint";
import { describe, it } from "vitest";

RuleTester.describe = describe;
RuleTester.it = it;
RuleTester.itOnly = it.only;

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
  },
});

type Tests = Parameters<RuleTester["run"]>[2];

/**
 * Run ESLint's `RuleTester` on a rule of this plugin, with the TypeScript parser.
 */
export function testRule(rule: { readonly ruleName: string, readonly ruleDefinition: RuleDefinition }, tests: Tests): void {
  ruleTester.run(rule.ruleName, rule.ruleDefinition as unknown as Rule.RuleModule, tests);
}
