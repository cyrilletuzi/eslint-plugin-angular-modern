# Changelog

## 1.5.0 (2026-08-18)

New `functional` preset (included in `recommended`) with the following new rules:
- [no-canactivate-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANACTIVATE_CLASS.md)
- [no-canactivatechild-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANACTIVATECHILD_CLASS.md)
- [no-candeactivate-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANDEACTIVATE_CLASS.md)
- [no-canmatch-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_CANMATCH_CLASS.md)
- [no-resolve-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_RESOLVE_CLASS.md)
- [no-httpinterceptor-class](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_HTTPINTERCEPTOR_CLASS.md)
- [no-httpinterceptors-token](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_HTTPINTERCEPTORS_TOKEN.md)
- [no-withinterceptorsfromdi](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/functional/NO_WITHINTERCEPTORSFROMDI.md)

## 1.4.0 (2026-08-17)

New `dependencyInjection` preset (included in `recommended`) with the following new rules:
- [no-constructor-injection](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_CONSTRUCTOR_INJECTION.md)
- [no-injectable-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_INJECTABLE_DECORATOR.md)
- [no-inject-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_INJECT_DECORATOR.md)
- [no-provider-deps](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/dependency-injection/NO_PROVIDER_DEPS.md)

## 1.3.0 (2026-08-15)

New `hostBindings` preset (included in `recommended`) with the following new rules:
- [no-hostbinding-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/host-bindings/NO_HOSTBINDING_DECORATOR.md)
- [no-hostlistener-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/host-bindings/NO_HOSTLISTENER_DECORATOR.md)

## 1.2.0 (2026-08-15)

New `stylingBindings` preset (included in `recommended`) with the following new rules:
- [no-ngclass](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/styling-bindings/NO_NGCLASS.md)
- [no-ngstyle](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/styling-bindings/NO_NGSTYLE.md)

New rule in `signals` and `recommended` presets:
- [no-attribute-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_ATTRIBUTE_DECORATOR.md)

## 1.1.0 (2026-08-13)

New `standalone` preset (included in `recommended`) with the following new rules:
- [no-ngmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_NGMODULE.md)
- [no-createngmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_CREATENGMODULE.md)
- [no-platformbrowser](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_PLATFORMBROWSER.md)
- [no-browsermodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_BROWSERMODULE.md)
- [no-browsertestingmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_BROWSERTESTINGMODULE.md)
- [no-applicationmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_APPLICATIONMODULE.md)
- [no-commonmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_COMMONMODULE.md)
- [no-routermodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_ROUTERMODULE.md)
- [no-serviceworkermodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_SERVICEWORKERMODULE.md)
- [no-servermodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_SERVERMODULE.md)
- [no-withmodule-testing](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_WITHMODULE_TESTING.md)

New related rules not in the preset:
- [no-material-modules](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone/NO_MATERIAL_MODULES.md)
- [no-ngmodule-component](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone-strict/NO_NGMODULE_COMPONENT.md)
- [no-ngmodule-directive](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone-strict/NO_NGMODULE_DIRECTIVE.md)
- [no-ngmodule-pipe](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/standalone-strict/NO_NGMODULE_PIPE.md)
- [no-platformbrowserdynamic](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_PLATFORMBROWSERDYNAMIC.md)
- [no-routertestingmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_ROUTERTESTINGMODULE.md)
- [no-httpclientmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTMODULE.md)
- [no-httpclientjsonpmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTJSONPMODULE.md)
- [no-httpclientxsrfmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTXSRFMODULE.md)
- [no-browseranimationsmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_BROWSERANIMATIONSMODULE.md)
- [no-noopanimationsmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_NOOPANIMATIONSMODULE.md)
- [no-httpclienttestingmodule](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/deprecated/NO_HTTPCLIENTTESTINGMODULE.md)

## 1.0.1 (2026-08-10)

Initial release with these rules:

From `angular-eslint-injection-context`:
- [inject-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/INJECT.md)
- [inject-async-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/INJECT_ASYNC.md)
- [effect-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/EFFECT.md)
- [after-every-render-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/AFTER_EVERY_RENDER.md)
- [after-next-render-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/AFTER_NEXT_RENDER.md)
- [after-render-effect-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/AFTER_RENDER_EFFECT.md)
- [signal-form-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/SIGNAL_FORM.md)
- [resource-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/RESOURCE.md)
- [rx-resource-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/RX_RESOURCE.md)
- [take-until-destroyed-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/TAKE_UNTIL_DESTROYED.md)
- [to-observable-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/TO_OBSERVABLE.md)
- [to-signal-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/TO_SIGNAL.md)
- [pending-until-event-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/PENDING_UNTIL_EVENT.md)
- [custom-function-in-injection-context](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/injection-context/CUSTOM_FUNCTION.md)

From `angular-eslint-zoneless`:
- [no-zonejs-import](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/rules/NO_ZONEJS_IMPORT.md)
- [no-providezonechangedetection](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/rules/NO_PROVIDEZONECHANGEDETECTION.md)
- [no-ngzone](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/rules/NO_NGZONE.md)
- [no-ngzone-testing](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/rules/NO_NGZONE_TESTING.md)
- [no-zonejs-testing-functions](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/rules/NO_ZONEJS_TESTING_FUNCTIONS.md)
- [no-directive-writable-property](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_DIRECTIVE_WRITABLE_PROPERTY.md)
- [no-directive-accessor](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_DIRECTIVE_ACCESSOR.md)
- [no-eager-change-detection](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_EAGER_CHANGE_DETECTION.md)
- [no-ngoninit](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGONINIT.md)
- [no-ngdocheck](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGDOCHECK.md)
- [no-ngonchanges](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGONCHANGES.md)
- [no-ngcontentviewinit](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGAFTERCONTENTINIT.md)
- [no-ngcontentviewchecked](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGAFTERCONTENTCHECKED.md)
- [no-ngafterviewinit](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGAFTERVIEWINIT.md)
- [no-ngafterviewchecked](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGAFTERVIEWCHECKED.md)
- [no-ngondestroy](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_NGONDESTROY.md)
- [no-input-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_INPUT_DECORATOR.md)
- [no-output-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_OUTPUT_DECORATOR.md)
- [no-content-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_CONTENT_DECORATOR.md)
- [no-view-decorator](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_VIEW_DECORATOR.md)
- [no-asyncpipe](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_ASYNCPIPE.md)
- [no-reactive-forms](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_REACTIVE_FORMS.md)
- [no-detectchanges-testing](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_DETECTCHANGES_TESTING.md)
- [no-changedetectorref](https://github.com/cyrilletuzi/eslint-plugin-angular-modern/blob/main/docs/signals/NO_CHANGEDETECTORREF.md) (now in the recommended preset)
