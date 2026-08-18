# Deprecated

For performance, to avoid redundant checks, this library presets do not enable the rules reporting deprecated features, which can already be reported by `@typescript-eslint/no-deprecated`:

```javascript
const tsEslint = require('typescript-eslint');

module.exports = defineConfig({
  files: ['**/*.ts'],
  languageOptions: {
    parserOptions: {
      projectService: true, // ⬅️ required
    },
  },
  extends: [
    tsEslint.configs.recommendedTypeChecked, // or `strictTypeChecked`
  ],
  rules: {
    '@typescript-eslint/no-deprecated': 'error' // ⬅️
  },
});
```

> [!TIP]
> The rule is already enabled in the TypeScript ESLint `strictTypeChecked` preset.

## Alternative lint rules

The TypeScript ESLint rule above requires [typed linting](https://typescript-eslint.io/getting-started/typed-linting). If for any reason, it cannot be enabled, the following rules are provided as a convenience and can be enabled individually.

### Standalone

- [no-platformbrowserdynamic](./NO_PLATFORMBROWSERDYNAMIC.md)
- [no-routertestingmodule](./NO_ROUTERTESTINGMODULE.md)
- [no-httpclientmodule](./NO_HTTPCLIENTMODULE.md)
- [no-httpclientjsonpmodule](./NO_HTTPCLIENTJSONPMODULE.md)
- [no-httpclientxsrfmodule](./NO_HTTPCLIENTXSRFMODULE.md)
- [no-httpclienttestingmodule](./NO_HTTPCLIENTTESTINGMODULE.md)
- [no-browseranimationsmodule](./NO_BROWSERANIMATIONSMODULE.md)
- [no-noopanimationsmodule](./NO_NOOPANIMATIONSMODULE.md)

```javascript
const angularModern = require('eslint-plugin-angular-modern');

module.exports = defineConfig({
  extends: [
    angularModern.configs.standalone, // or `recommended`
  ],
  rules: {
    'eslint-plugin-angular-modern/no-platformbrowserdynamic': 'error',
    'eslint-plugin-angular-modern/no-routertestingmodule': 'error',
    'eslint-plugin-angular-modern/no-httpclientmodule': 'error',
    'eslint-plugin-angular-modern/no-httpclientjsonpmodule': 'error',
    'eslint-plugin-angular-modern/no-httpclientxsrfmodule': 'error',
    'eslint-plugin-angular-modern/no-httpclienttestingmodule': 'error',
    'eslint-plugin-angular-modern/no-browseranimationsmodule': 'error',
    'eslint-plugin-angular-modern/no-noopanimationsmodule': 'error',
  },
});
```

### Functional

- [no-canload-class](./NO_CANLOAD_CLASS.md)

```javascript
const angularModern = require('eslint-plugin-angular-modern');

module.exports = defineConfig({
  extends: [
    angularModern.configs.functional, // or `recommended`
  ],
  rules: {
    'eslint-plugin-angular-modern/no-canload-class': 'error',
  },
});
```

[Back to README](../../README.md)
