# Angular ESLint

This lint package does not require `angular-eslint`, it only depends on TypeScript ESLint.

`angular-eslint` and `eslint-plugin-angular-modern` can be used together in a project, but some rules may be redundant. For better performance and avoid duplicate reports, specific rules can be disabled.

If the project is just using `angular-eslint` recommended preset:

```javascript
defineConfig({
  files: ['**/*.ts'],
  rules: {
    // When already using `signals` or `recommended` presets:
    '@angular-eslint/contextual-lifecycle': 'off',
    '@angular-eslint/no-empty-lifecycle-method': 'off',
    '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    '@angular-eslint/use-lifecycle-interface': 'off',
    // When already using `dependencyInjection` or `recommended` presets:
    '@angular-eslint/prefer-inject': 'off',
    // When already using `standalone` or `recommended` presets and `strictStandalone`:
    '@angular-eslint/prefer-standalone': 'off',
  },
}, {
  files: ['**/*.html'],
  rules: {
    // When already using `signals` or `recommended` presets:
    '@angular-eslint/template/no-negated-async': 'off',
  },
})
```

If the project is using other `angular-eslint` rules, the whole list:

```javascript
{
  files: ['**/*.ts'],
  rules: {
    // When already using `signals` or `recommended` presets:
    '@angular-eslint/contextual-decorator': 'off',
    '@angular-eslint/contextual-lifecycle': 'off',
    '@angular-eslint/no-async-lifecycle-method': 'off',
    '@angular-eslint/no-attribute-decorator': 'off',
    '@angular-eslint/no-empty-lifecycle-method': 'off',
    '@angular-eslint/no-lifecycle-call': 'off',
    '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    '@angular-eslint/prefer-output-emitter-ref': 'off',
    '@angular-eslint/prefer-signals': 'off',
    '@angular-eslint/require-lifecycle-on-prototype': 'off',
    '@angular-eslint/sort-lifecycle-methods': 'off',
    '@angular-eslint/use-lifecycle-interface': 'off',
    // When already using `dependencyInjection` or `recommended` presets:
    '@angular-eslint/prefer-service-decorator': 'off',
    '@angular-eslint/prefer-inject': 'off',
    '@angular-eslint/use-injectable-provided-in': 'off',
    // When already using `standalone` or `recommended` presets and `strictStandalone`:
    '@angular-eslint/prefer-standalone': 'off',
    // When already using `injectionContext` or `recommended` presets:
    '@angular-eslint/no-implicit-take-until-destroyed': 'off',
    // When already using `hostBindings` or `recommended` presets:
    '@angular-eslint/prefer-host-metadata-property': 'off',
  },
}, {
  files: ['**/*.html'],
  rules: {
    // When already using `signals` or `recommended` presets:
    '@angular-eslint/template/no-negated-async': 'off',
    // When already using `stylingBindings` or `recommended` presets:
    '@angular-eslint/template/prefer-class-binding': 'off',
  },
}
```

[Back to README](../README.md)
