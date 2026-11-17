// Generates Oxlint JSON presets from the ESLint presets, so they cannot drift apart.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import plugin from "../dist/index.js";

const outputPath = join(import.meta.dirname, "..", "dist", "oxlint");

mkdirSync(outputPath, { recursive: true });

for (const [presetName, config] of Object.entries(plugin.configs)) {
  const preset = {
    jsPlugins: [plugin.meta.name],
    rules: config.rules,
  };

  writeFileSync(join(outputPath, `${presetName}.json`), `${JSON.stringify(preset, null, 2)}\n`);
}
