import type { ConfigObject, Plugin } from "@eslint/core";
import * as noSubscribeInComponentConstructor from "./rules/experimental/no-subscribe-in-component-constructor.js";
import * as afterEveryRenderInInjectionContext from "./rules/injection-context/after-every-render-in-injection-context.js";
import * as afterNextRenderInInjectionContext from "./rules/injection-context/after-next-render-in-injection-context.js";
import * as afterRenderEffectInInjectionContext from "./rules/injection-context/after-render-effect-in-injection-context.js";
import * as customFunctionInInjectionContext from "./rules/injection-context/custom-function-in-injection-context.js";
import * as effectInInjectionContext from "./rules/injection-context/effect-in-injection-context.js";
import * as injectAsyncInInjectionContext from "./rules/injection-context/inject-async-in-injection-context.js";
import * as injectInInjectionContext from "./rules/injection-context/inject-in-injection-context.js";
import * as pendingUntilEventInInjectionContext from "./rules/injection-context/pending-until-event-in-injection-context.js";
import * as resourceInInjectionContext from "./rules/injection-context/resource-in-injection-context.js";
import * as rxResourceInInjectionContext from "./rules/injection-context/rx-resource-in-injection-context.js";
import * as signalFormInInjectionContext from "./rules/injection-context/signal-form-in-injection-context.js";
import * as takeUntilDestroyedInInjectionContext from "./rules/injection-context/take-until-destroyed-in-injection-context.js";
import * as toObservableInInjectionContext from "./rules/injection-context/to-observable-in-injection-context.js";
import * as toSignalInInjectionContext from "./rules/injection-context/to-signal-in-injection-context.js";
import * as noAsyncpipe from "./rules/signals/no-asyncpipe.js";
import * as noChangedetectorref from "./rules/signals/no-changedetectorref.js";
import * as noContentDecorator from "./rules/signals/no-content-decorator.js";
import * as noDetectchangesTesting from "./rules/signals/no-detectchanges-testing.js";
import * as noDirectiveAccessor from "./rules/signals/no-directive-accessor.js";
import * as noDirectiveWritableProperty from "./rules/signals/no-directive-writable-property.js";
import * as noEagerChangeDetection from "./rules/signals/no-eager-change-detection.js";
import * as noInputDecorator from "./rules/signals/no-input-decorator.js";
import * as noNgaftercontentchecked from "./rules/signals/no-ngaftercontentchecked.js";
import * as noNgaftercontentinit from "./rules/signals/no-ngaftercontentinit.js";
import * as noNgafterviewchecked from "./rules/signals/no-ngafterviewchecked.js";
import * as noNgafterviewinit from "./rules/signals/no-ngafterviewinit.js";
import * as noNgdocheck from "./rules/signals/no-ngdocheck.js";
import * as noNgonchanges from "./rules/signals/no-ngonchanges.js";
import * as noNgondestroy from "./rules/signals/no-ngondestroy.js";
import * as noNgoninit from "./rules/signals/no-ngoninit.js";
import * as noOutputDecorator from "./rules/signals/no-output-decorator.js";
import * as noReactiveForms from "./rules/signals/no-reactive-forms.js";
import * as noViewDecorator from "./rules/signals/no-view-decorator.js";
import * as noNgzoneTesting from "./rules/zoneless/no-ngzone-testing.js";
import * as noNgzone from "./rules/zoneless/no-ngzone.js";
import * as noProvidezonechangedetection from "./rules/zoneless/no-providezonechangedetection.js";
import * as noZonejsImport from "./rules/zoneless/no-zonejs-import.js";
import * as noZonejsTestingFunctions from "./rules/zoneless/no-zonejs-testing-functions.js";

const { name, version } =
  // importing here would bypass the tsconfig `"rootDir": "src"`
  require("./package.json") as typeof import("./package.json");

const plugin = {
  configs: {
    get injectionContext() {
      return injectionContext;
    },
    get zoneless() {
      return zoneless;
    },
    get signals() {
      return signals;
    },
    get recommended() {
      return recommended;
    },
  },
  meta: { name, version },
  rules: {
    // Injection context
    [injectInInjectionContext.ruleName]: injectInInjectionContext.ruleDefinition,
    [injectAsyncInInjectionContext.ruleName]: injectAsyncInInjectionContext.ruleDefinition,
    [takeUntilDestroyedInInjectionContext.ruleName]: takeUntilDestroyedInInjectionContext.ruleDefinition,
    [toSignalInInjectionContext.ruleName]: toSignalInInjectionContext.ruleDefinition,
    [toObservableInInjectionContext.ruleName]: toObservableInInjectionContext.ruleDefinition,
    [rxResourceInInjectionContext.ruleName]: rxResourceInInjectionContext.ruleDefinition,
    [resourceInInjectionContext.ruleName]: resourceInInjectionContext.ruleDefinition,
    [effectInInjectionContext.ruleName]: effectInInjectionContext.ruleDefinition,
    [afterEveryRenderInInjectionContext.ruleName]: afterEveryRenderInInjectionContext.ruleDefinition,
    [afterNextRenderInInjectionContext.ruleName]: afterNextRenderInInjectionContext.ruleDefinition,
    [afterRenderEffectInInjectionContext.ruleName]: afterRenderEffectInInjectionContext.ruleDefinition,
    [signalFormInInjectionContext.ruleName]: signalFormInInjectionContext.ruleDefinition,
    [pendingUntilEventInInjectionContext.ruleName]: pendingUntilEventInInjectionContext.ruleDefinition,
    [customFunctionInInjectionContext.ruleName]: customFunctionInInjectionContext.ruleDefinition,
    // Zoneless
    [noZonejsImport.ruleName]: noZonejsImport.ruleDefinition,
    [noProvidezonechangedetection.ruleName]: noProvidezonechangedetection.ruleDefinition,
    [noNgzone.ruleName]: noNgzone.ruleDefinition,
    [noNgzoneTesting.ruleName]: noNgzoneTesting.ruleDefinition,
    [noZonejsTestingFunctions.ruleName]: noZonejsTestingFunctions.ruleDefinition,
    // Signals
    [noDirectiveWritableProperty.ruleName]: noDirectiveWritableProperty.ruleDefinition,
    [noDirectiveAccessor.ruleName]: noDirectiveAccessor.ruleDefinition,
    [noEagerChangeDetection.ruleName]: noEagerChangeDetection.ruleDefinition,
    [noNgoninit.ruleName]: noNgoninit.ruleDefinition,
    [noNgdocheck.ruleName]: noNgdocheck.ruleDefinition,
    [noNgonchanges.ruleName]: noNgonchanges.ruleDefinition,
    [noNgaftercontentinit.ruleName]: noNgaftercontentinit.ruleDefinition,
    [noNgaftercontentchecked.ruleName]: noNgaftercontentchecked.ruleDefinition,
    [noNgafterviewinit.ruleName]: noNgafterviewinit.ruleDefinition,
    [noNgafterviewchecked.ruleName]: noNgafterviewchecked.ruleDefinition,
    [noNgondestroy.ruleName]: noNgondestroy.ruleDefinition,
    [noInputDecorator.ruleName]: noInputDecorator.ruleDefinition,
    [noOutputDecorator.ruleName]: noOutputDecorator.ruleDefinition,
    [noContentDecorator.ruleName]: noContentDecorator.ruleDefinition,
    [noViewDecorator.ruleName]: noViewDecorator.ruleDefinition,
    [noAsyncpipe.ruleName]: noAsyncpipe.ruleDefinition,
    [noDetectchangesTesting.ruleName]: noDetectchangesTesting.ruleDefinition,
    [noChangedetectorref.ruleName]: noChangedetectorref.ruleDefinition,
    [noReactiveForms.ruleName]: noReactiveForms.ruleDefinition,
    // Experimental
    [noSubscribeInComponentConstructor.ruleName]: noSubscribeInComponentConstructor.ruleDefinition,
  },
} satisfies Plugin;

const injectionContext: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${injectInInjectionContext.ruleName}`]: "error",
    [`${name}/${injectAsyncInInjectionContext.ruleName}`]: "error",
    [`${name}/${takeUntilDestroyedInInjectionContext.ruleName}`]: "error",
    [`${name}/${toSignalInInjectionContext.ruleName}`]: "error",
    [`${name}/${toObservableInInjectionContext.ruleName}`]: "error",
    [`${name}/${rxResourceInInjectionContext.ruleName}`]: "error",
    [`${name}/${resourceInInjectionContext.ruleName}`]: "error",
    [`${name}/${effectInInjectionContext.ruleName}`]: "error",
    [`${name}/${afterEveryRenderInInjectionContext.ruleName}`]: "error",
    [`${name}/${afterNextRenderInInjectionContext.ruleName}`]: "error",
    [`${name}/${afterRenderEffectInInjectionContext.ruleName}`]: "error",
    [`${name}/${signalFormInInjectionContext.ruleName}`]: "error",
    [`${name}/${pendingUntilEventInInjectionContext.ruleName}`]: "error",
  },
};

const zoneless: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noZonejsImport.ruleName}`]: "error",
    [`${name}/${noProvidezonechangedetection.ruleName}`]: "error",
    [`${name}/${noNgzone.ruleName}`]: "error",
    [`${name}/${noNgzoneTesting.ruleName}`]: "error",
    [`${name}/${noZonejsTestingFunctions.ruleName}`]: "error",
  },
};

const signals: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noDirectiveWritableProperty.ruleName}`]: "error",
    [`${name}/${noDirectiveAccessor.ruleName}`]: "error",
    [`${name}/${noEagerChangeDetection.ruleName}`]: "error",
    [`${name}/${noNgoninit.ruleName}`]: "error",
    [`${name}/${noNgdocheck.ruleName}`]: "error",
    [`${name}/${noNgonchanges.ruleName}`]: "error",
    [`${name}/${noNgaftercontentinit.ruleName}`]: "error",
    [`${name}/${noNgaftercontentchecked.ruleName}`]: "error",
    [`${name}/${noNgafterviewinit.ruleName}`]: "error",
    [`${name}/${noNgafterviewchecked.ruleName}`]: "error",
    [`${name}/${noNgondestroy.ruleName}`]: "error",
    [`${name}/${noInputDecorator.ruleName}`]: "error",
    [`${name}/${noOutputDecorator.ruleName}`]: "error",
    [`${name}/${noContentDecorator.ruleName}`]: "error",
    [`${name}/${noViewDecorator.ruleName}`]: "error",
    [`${name}/${noAsyncpipe.ruleName}`]: "error",
    [`${name}/${noReactiveForms.ruleName}`]: "error",
    [`${name}/${noDetectchangesTesting.ruleName}`]: "error",
    [`${name}/${noChangedetectorref.ruleName}`]: "error",
  },
};

const recommended: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    ...injectionContext.rules,
    ...zoneless.rules,
    ...signals.rules,
  },
};

export = plugin;