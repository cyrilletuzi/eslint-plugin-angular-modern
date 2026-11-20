import { Linter } from "eslint";
import { existsSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";
import { parser } from "typescript-eslint";
import { describe, expect, it } from "vitest";
import plugin from "../src/index.js";

const rulesDirectory = join(process.cwd(), "src/rules");
const docsBaseUrl = "https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/";
const pluginName: string = plugin.meta?.name ?? "";
const presets = plugin.configs as Record<string, Linter.Config>;

const ruleFiles: readonly string[] = readdirSync(rulesDirectory, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".ts"));

describe("plugin", () => {
  it("has a name", () => {
    expect(pluginName).toBe("eslint-plugin-angular-modern");
  });

  it("registers every rule file", () => {
    expect(Object.keys(plugin.rules ?? {}).sort()).toEqual(ruleFiles.map((file) => basename(file, ".ts")).sort());
  });

  describe.each(ruleFiles)("rule %s", (file) => {
    it("is registered under its file name", async () => {
      const module = await import(join(rulesDirectory, file)) as { ruleName: string; };
      expect(module.ruleName).toBe(basename(file, ".ts"));
    });

    it("has an existing documentation", () => {
      const url = plugin.rules?.[basename(file, ".ts")]?.meta?.docs?.url ?? "";
      expect(url.startsWith(docsBaseUrl)).toBe(true);
      expect(existsSync(join(process.cwd(), url.slice(docsBaseUrl.length)))).toBe(true);
    });
  });
});

describe.each(Object.entries(presets))("preset %s", (_presetName, preset) => {

  it("only enables existing rules", () => {
    const presetRules = Object.keys(preset.rules ?? {});
    expect(presetRules.length).toBeGreaterThan(0);
    for (const rule of presetRules) {
      expect(rule.startsWith(`${pluginName}/`)).toBe(true);
      expect(plugin.rules).toHaveProperty([rule.slice(pluginName.length + 1)]);
    }
  });

  it("can be used to lint", () => {
    const messages = new Linter().verify(`@NgModule() class A {}`, [
      { languageOptions: { parser } },
      preset,
    ]);
    expect(messages.every((message) => !message.fatal)).toBe(true);
  });
});

describe("recommended preset", () => {
  it("includes all other presets", () => {
    const recommendedRules = Object.keys(presets["recommended"]?.rules ?? {});
    for (const [presetName, preset] of Object.entries(presets)) {
      if (presetName !== "recommended") {
        expect(recommendedRules, presetName).toEqual(expect.arrayContaining(Object.keys(preset.rules ?? {})));
      }
    }
  });
});
