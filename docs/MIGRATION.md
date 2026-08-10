# Migration

This library is a merge of `angular-eslint-injection-context` and `angular-eslint-zoneless` libraries. Rules names and behaviors are the exact same, only the package name has changed.

- Migration from `angular-eslint-injection-context`
- Migration from `angular-eslint-zoneless`

## Migration from angular-eslint-injection-context

1. Replace the package

```bash
npm uninstall angular-eslint-injection-context
npm install eslint-plugin-angular-modern --save-dev
```

2. Replace the configuration in `eslint.config.js`

```javascript
// Before
const angularEslintInjectionContext = require("angular-eslint-injection-context");

module.exports = defineConfig({
  extends: [
    angularEslintInjectionContext.configs.recommended,
  ],
  rules: {
    // If some individual rules are configured:
    "angular-eslint-injection-context/inject-in-injection-context": "error",
  },
});

// After
const angularModern = require("eslint-plugin-angular-modern");

module.exports = defineConfig({
  extends: [
    angularModern.configs.injectionContext,
  ],
  rules: {
    // If some individual rules are configured:
    "eslint-plugin-angular-modern/inject-in-injection-context": "error",
  },
});
```

3. Search `angular-eslint-injection-context` and replace with `eslint-plugin-angular-modern` in the project (in case there are some `// eslint-disable` comments)

## Migration from angular-eslint-zoneless

1. Replace the package

```bash
npm uninstall angular-eslint-zoneless
npm install eslint-plugin-angular-modern --save-dev
```

2. Replace the configuration in `eslint.config.js`

```javascript
// Before
const angularEslintZoneless = require("angular-eslint-zoneless");

module.exports = defineConfig({
  extends: [
    angularEslintInjectionContext.configs.minimal,
    // or
    angularEslintInjectionContext.configs.recommended,
    // or
    angularEslintInjectionContext.configs.strict,
  ],
  rules: {
    // If some individual rules are configured:
    "angular-eslint-zoneless/no-asyncpipe": "error",
  },
});

// After
const angularModern = require("eslint-plugin-angular-modern");

module.exports = defineConfig({
  extends: [
    // In all cases:
    angularModern.configs.zoneless,
    // + if coming from `recommended` or `strict`:
    angularModern.configs.signals,
  ],
  rules: {
    // If some individual rules are configured:
    "eslint-plugin-angular-modern/no-asyncpipe": "error",
  },
});
```

3. Search `angular-eslint-zoneless` and replace with `eslint-plugin-angular-modern` in the project (in case there are some `// eslint-disable` comments)

[Back to README](../README.md)