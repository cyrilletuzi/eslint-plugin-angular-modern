# eslint-plugin-angular-modern

70+ ESLint rules for modern and safe Angular.

> [!NOTE]
> Find this tool useful? I’m open to freelance & full-time opportunities.
> Feel free to reach out on [LinkedIn](https://www.linkedin.com/in/cyrilletuzi/) or [Bluesky](https://bsky.app/profile/cyrilletuzi.com).

## Goals

1. **Enforce modern Angular**

Angular has evolved a lot: standalone components, new control flow syntax, new dependency injection, zoneless, signals... One could even argue it is a new framework. It has been done in a backward compatible way, which is nice, but it also has a downside: a lot of legacy features are still available, both for developers and for AI tools. Lint rules can restrict the usage of these legacy features, in a reliable way (unlike AI custom instructions and skills, which are often not followed).

A [blog post](https://dev.to/cyrilletuzi/angular-zoneless-lint-rules-enforce-signals-patterns-4fc) explains this goal in more details.

2. **Enforce safe Angular usage**

Some of the new features, especially the new dependency injection, can produce runtime errors, not protected by compilation. Lint rules can lower the risk of these runtime errors. 

Another [blog post](https://dev.to/cyrilletuzi/angular-injection-context-lint-rules-say-goodbye-to-ng0203-error-3g5i) explains this goal in more details.

## Requirements

- TypeScript ESLint v8
- New flat ESLint configuration (`eslint.config.js` or equivalent)

> [!NOTE]
> `.eslintrc.json` and other legacy ESLint configurations are not supported.

> [!IMPORTANT]
> The default presets target the latest Angular stable version. Some rules may be unsuitable for previous versions, see "Angular versions" section below to adapt the configuration accordingly.

## Getting started

1. Installation

```bash
npm install eslint-plugin-angular-modern --save-dev
```

2. ESLint flat configuration (`eslint.config.js` or equivalent)

```javascript
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tsEslint = require("typescript-eslint");
const angularModern = require("eslint-plugin-angular-modern"); // ⬅️ add this

module.exports = defineConfig({
  files: ["**/*.ts"],
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  extends: [
    eslint.configs.recommended,
    tsEslint.configs.strictTypeChecked,
    tsEslint.configs.stylisticTypeChecked,
    angularModern.configs.recommended, // ⬅️ add this (or one of the other presets below)
  ],
  rules: {},
});
```

3. `npm run lint`

> [!NOTE]
> In VS Code, it may be required to restart for the ESLint extension to apply the new rules.

## Migration

If coming from `angular-eslint-injection-context` or `angular-eslint-zoneless` libraries, a [migration guide](./docs/MIGRATION.md) is available.

## Recommended preset

```javascript
{ extends: [angularModern.configs.recommended] }
```

**The recommended preset enables all the rules** of all the features presets below. It is the recommended preset for:
- new projects
- projects already fully migrated to modern Angular

## Features presets

A feature preset enables the rules for a specific set of features. It is recommended for projects only partially migrated to modern Angular.

### Injection context preset

```javascript
{ extends: [angularModern.configs.injectionContext] }
```

**These safety rules check that `inject()` and similar functions (`toSignal()`, `resource()`, `form()`...) are called in an injection context**, to avoid the [`NG0203`](https://angular.dev/errors/NG0203) _runtime_ error:

- [inject-in-injection-context](./docs/injection-context/INJECT.md)
- [inject-async-in-injection-context](./docs/injection-context/INJECT_ASYNC.md)
- [effect-in-injection-context](./docs/injection-context/EFFECT.md)
- [after-every-render-in-injection-context](./docs/injection-context/AFTER_EVERY_RENDER.md)
- [after-next-render-in-injection-context](./docs/injection-context/AFTER_NEXT_RENDER.md)
- [after-render-effect-in-injection-context](./docs/injection-context/AFTER_RENDER_EFFECT.md)
- [signal-form-in-injection-context](./docs/injection-context/SIGNAL_FORM.md)
- [resource-in-injection-context](./docs/injection-context/RESOURCE.md)
- [rx-resource-in-injection-context](./docs/injection-context/RX_RESOURCE.md)
- [take-until-destroyed-in-injection-context](./docs/injection-context/TAKE_UNTIL_DESTROYED.md)
- [to-observable-in-injection-context](./docs/injection-context/TO_OBSERVABLE.md)
- [to-signal-in-injection-context](./docs/injection-context/TO_SIGNAL.md)
- [pending-until-event-in-injection-context](./docs/injection-context/PENDING_UNTIL_EVENT.md)

> [!TIP]
> This safety preset can and should always be enabled, even if a project has not yet migrated to `inject()`.

#### Custom functions

For other functions requiring the injection context (custom ones or from libraries), an additional rule is available:
- [custom-function-in-injection-context](./docs/injection-context/CUSTOM_FUNCTION.md)

### Dependency injection preset

```javascript
{ extends: [angularModern.configs.dependencyInjection] }
```

**These rules enforce using the new dependency injection system:**

- [no-constructor-injection](./docs/dependency-injection/NO_CONSTRUCTOR_INJECTION.md)
- [no-injectable-decorator](./docs/dependency-injection/NO_INJECTABLE_DECORATOR.md)
- [no-inject-decorator](./docs/dependency-injection/NO_INJECT_DECORATOR.md)
- [no-provider-deps](./docs/dependency-injection/NO_PROVIDER_DEPS.md)

### Zoneless preset

```javascript
{ extends: [angularModern.configs.zoneless] }
```

**These rules enforce a zoneless application to not use zone.js-based features:**

- [no-zonejs-import](./docs/zoneless/NO_ZONEJS_IMPORT.md)
- [no-providezonechangedetection](./docs/zoneless/NO_PROVIDEZONECHANGEDETECTION.md)
- [no-ngzone](./docs/zoneless/NO_NGZONE.md)
- [no-ngzone-testing](./docs/zoneless/NO_NGZONE_TESTING.md)
- [no-zonejs-testing-functions](./docs/zoneless/NO_ZONEJS_TESTING_FUNCTIONS.md)

### Signals preset

```javascript
{ extends: [angularModern.configs.signals] }
```

**These rules enforce a project to handle reactivity with signals:**

- [no-directive-writable-property](./docs/signals/NO_DIRECTIVE_WRITABLE_PROPERTY.md)
- [no-directive-accessor](./docs/signals/NO_DIRECTIVE_ACCESSOR.md)
- [no-eager-change-detection](./docs/signals/NO_EAGER_CHANGE_DETECTION.md)
- [no-ngoninit](./docs/signals/NO_NGONINIT.md)
- [no-ngdocheck](./docs/signals/NO_NGDOCHECK.md)
- [no-ngonchanges](./docs/signals/NO_NGONCHANGES.md)
- [no-ngcontentviewinit](./docs/signals/NO_NGAFTERCONTENTINIT.md)
- [no-ngcontentviewchecked](./docs/signals/NO_NGAFTERCONTENTCHECKED.md)
- [no-ngafterviewinit](./docs/signals/NO_NGAFTERVIEWINIT.md)
- [no-ngafterviewchecked](./docs/signals/NO_NGAFTERVIEWCHECKED.md)
- [no-ngondestroy](./docs/signals/NO_NGONDESTROY.md)
- [no-input-decorator](./docs/signals/NO_INPUT_DECORATOR.md)
- [no-output-decorator](./docs/signals/NO_OUTPUT_DECORATOR.md)
- [no-content-decorator](./docs/signals/NO_CONTENT_DECORATOR.md)
- [no-view-decorator](./docs/signals/NO_VIEW_DECORATOR.md)
- [no-attribute-decorator](./docs/signals/NO_ATTRIBUTE_DECORATOR.md)
- [no-asyncpipe](./docs/signals/NO_ASYNCPIPE.md)
- [no-reactive-forms](./docs/signals/NO_REACTIVE_FORMS.md)
- [no-detectchanges-testing](./docs/signals/NO_DETECTCHANGES_TESTING.md)
- [no-changedetectorref](./docs/signals/NO_CHANGEDETECTORREF.md)

> [!TIP]
> This preset should only be enabled after a project has fully migrated to signals. Otherwise, individual rules should be enabled gradually.

### Standalone preset

```javascript
{ extends: [angularModern.configs.standalone] }
```

**These rules enforce a standalone application to not use NgModules:**

- [no-ngmodule](./docs/standalone/NO_NGMODULE.md)
- [no-createngmodule](./docs/standalone/NO_CREATENGMODULE.md)
- [no-platformbrowser](./docs/standalone/NO_PLATFORMBROWSER.md)
- [no-browsermodule](./docs/standalone/NO_BROWSERMODULE.md)
- [no-browsertestingmodule](./docs/standalone/NO_BROWSERTESTINGMODULE.md)
- [no-applicationmodule](./docs/standalone/NO_APPLICATIONMODULE.md)
- [no-commonmodule](./docs/standalone/NO_COMMONMODULE.md)
- [no-routermodule](./docs/standalone/NO_ROUTERMODULE.md)
- [no-serviceworkermodule](./docs/standalone/NO_SERVICEWORKERMODULE.md)
- [no-servermodule](./docs/standalone/NO_SERVERMODULE.md)
- [no-withmodule-testing](./docs/standalone/NO_WITHMODULE_TESTING.md)

> [!TIP]
> To fully enforce standalone, 2 other checks must be enabled too:
> - the `strictStandalone` Angular compiler option: [documentation](./docs/standalone-strict/STRICT_STANDALONE.md)
> - the `@typescript-eslint/no-deprecated` rule: [documentation](./docs/deprecated/DEPRECATED.md)

#### Libraries modules

Additional individual rules, _not_ included in the preset, are available for some libraries:

- [no-material-modules](./docs/standalone/NO_MATERIAL_MODULES.md)

### Styling bindings preset

```javascript
{ extends: [angularModern.configs.stylingBindings] }
```

**These rules enforce native styling bindings:**

- [no-ngclass](./docs/styling-bindings/NO_NGCLASS.md)
- [no-ngstyle](./docs/styling-bindings/NO_NGSTYLE.md)

### Host bindings preset

```javascript
{ extends: [angularModern.configs.hostBindings] }
```

**These rules enforce typed checked host bindings:**

- [no-hostbinding-decorator](./docs/host-bindings/NO_HOSTBINDING_DECORATOR.md)
- [no-hostlistener-decorator](./docs/host-bindings/NO_HOSTLISTENER_DECORATOR.md)

## Other rules

The following invidiual rules are _not_ in presets.

### Rules already reported by `strictStandalone`

See [the documentation](./docs/standalone-strict/STRICT_STANDALONE.md) to enable Angular `strictStandalone` compiler option.

- [no-ngmodule-component](./docs/standalone-strict/NO_NGMODULE_COMPONENT.md)
- [no-ngmodule-directive](./docs/standalone-strict/NO_NGMODULE_DIRECTIVE.md)
- [no-ngmodule-pipe](./docs/standalone-strict/NO_NGMODULE_PIPE.md)

### Rules already reported by `@typescript-eslint/no-deprecated`

See [the documentation](./docs/deprecated/DEPRECATED.md) to enable `@typescript-eslint/no-deprecated` rule.

- [no-platformbrowserdynamic](./docs/deprecated/NO_PLATFORMBROWSERDYNAMIC.md)
- [no-routertestingmodule](./docs/deprecated/NO_ROUTERTESTINGMODULE.md)
- [no-httpclientmodule](./docs/deprecated/NO_HTTPCLIENTMODULE.md)
- [no-httpclientjsonpmodule](./docs/deprecated/NO_HTTPCLIENTJSONPMODULE.md)
- [no-httpclientxsrfmodule](./docs/deprecated/NO_HTTPCLIENTXSRFMODULE.md)
- [no-httpclienttestingmodule](./docs/deprecated/NO_HTTPCLIENTTESTINGMODULE.md)
- [no-browseranimationsmodule](./docs/deprecated/NO_BROWSERANIMATIONSMODULE.md)
- [no-noopanimationsmodule](./docs/deprecated/NO_NOOPANIMATIONSMODULE.md)

### Experimental

Rules still being tested.

- [no-subscribe-in-component-constructor](./docs/experimental/NO_SUBSCRIBE_IN_COMPONENT_CONSTRUCTOR.md)

## Angular versions

The presets above target the latest Angular stable version (currently v22). Some rules may be unsuitable for previous versions and must be disabled.

### Angular 21

```javascript
module.exports = defineConfig({
  rules: {
    "eslint-plugin-angular-modern/no-injectable-decorator": "off",
  },
});
```

### Angular 20

```javascript
module.exports = defineConfig({
  rules: {
    "eslint-plugin-angular-modern/no-injectable-decorator": "off",
    "eslint-plugin-angular-modern/no-reactive-forms": "off",
  },
});
```

## FAQ

> Why not in Angular ESLint?

I proposed a [Pull Request](https://github.com/angular-eslint/angular-eslint/pull/2892), but it has been ignored for months, then rejected without a reason. So I decided to publish the rule by myself, and to add many more.

> Is Angular ESLint required?

No, these rules only depends on TypeScript ESLint.

> Is typed linting required?

[Typed linting](https://typescript-eslint.io/getting-started/typed-linting) is not required for now, but it could change in the future.

> Is adding a plugin making the project heavier?

No, the package has 0 dependency. It just add lint rules using TypeScript ESLint, which is already installed in the project.

## License

MIT
