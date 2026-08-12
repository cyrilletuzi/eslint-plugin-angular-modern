# Strict standalone

To fully enforce standalone, the `strictStandalone` Angular compiler option should be enabled, in addition to the `standalone` or `recommended` preset of this library.

In `tsconfig.json`:
```json
{
  "angularCompilerOptions": {
    "strictStandalone": true
  }
}
```

## Alternative lint rules

Because the Angular `strictStandalone` option is already doing these checks, it is why the following lint rules are _not_ enabled in the `standalone` or `recommended` presets:

- [no-ngmodule-component](../experimental/NO_NGMODULE_COMPONENT.md)
- [no-ngmodule-directive](../experimental/NO_NGMODULE_DIRECTIVE.md)
- [no-ngmodule-pipe](../experimental/NO_NGMODULE_PIPE.md)

They are provided individually just as a convenience: the `strictStandalone` is better for a new project or for a project already fully migrated to standalone. But for a project still in ongoing migration, the issue with a compiler option is that it is all or nothing: all the components, directives and pipes must be standalone. Lint rules can be disabled locally to allow a gradual migration.

[Back to README](../../README.md)
