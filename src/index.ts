import type { ConfigObject, Plugin } from "@eslint/core";
import * as noConstructorInjection from "./rules/dependency-injection/no-constructor-injection.js";
import * as noInjectDecorator from "./rules/dependency-injection/no-inject-decorator.js";
import * as noInjectableDecorator from "./rules/dependency-injection/no-injectable-decorator.js";
import * as noProviderDeps from "./rules/dependency-injection/no-provider-deps.js";
import * as noBrowseranimationsmodule from "./rules/deprecated/no-browseranimationsmodule.js";
import * as noCanloadClass from "./rules/deprecated/no-canload-class.js";
import * as noHttpclientjsonpmodule from "./rules/deprecated/no-httpclientjsonpmodule.js";
import * as noHttpclientmodule from "./rules/deprecated/no-httpclientmodule.js";
import * as noHttpclienttestingmodule from "./rules/deprecated/no-httpclienttestingmodule.js";
import * as noHttpclientxsrfmodule from "./rules/deprecated/no-httpclientxsrfmodule.js";
import * as noNoopanimationsmodule from "./rules/deprecated/no-noopanimationsmodule.js";
import * as noPlatformbrowserdynamic from "./rules/deprecated/no-platformbrowserdynamic.js";
import * as noRoutertestingmodule from "./rules/deprecated/no-routertestingmodule.js";
import * as noSubscribeInComponentConstructor from "./rules/experimental/no-subscribe-in-component-constructor.js";
import * as noHttpReportprogress from "./rules/fetch-http/no-http-reportprogress.js";
import * as noHttpReportuploadprogress from "./rules/fetch-http/no-http-reportuploadprogress.js";
import * as noHttpxhrbackend from "./rules/fetch-http/no-httpxhrbackend.js";
import * as noWithxhr from "./rules/fetch-http/no-withxhr.js";
import * as noCanactivateClass from "./rules/functional/no-canactivate-class.js";
import * as noCanactivatechildClass from "./rules/functional/no-canactivatechild-class.js";
import * as noCandeactivateClass from "./rules/functional/no-candeactivate-class.js";
import * as noCanmatchClass from "./rules/functional/no-canmatch-class.js";
import * as noHttpinterceptorClass from "./rules/functional/no-httpinterceptor-class.js";
import * as noHttpinterceptorsToken from "./rules/functional/no-httpinterceptors-token.js";
import * as noResolveClass from "./rules/functional/no-resolve-class.js";
import * as noWithinterceptorsfromdi from "./rules/functional/no-withinterceptorsfromdi.js";
import * as noHostbindingDecorator from "./rules/host-bindings/no-hostbinding-decorator.js";
import * as noHostlistenerDecorator from "./rules/host-bindings/no-hostlistener-decorator.js";
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
import * as noAttributeDecorator from "./rules/signals/no-attribute-decorator.js";
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
import * as noNgmoduleComponent from "./rules/standalone-strict/no-ngmodule-component.js";
import * as noNgmoduleDirective from "./rules/standalone-strict/no-ngmodule-directive.js";
import * as noNgmodulePipe from "./rules/standalone-strict/no-ngmodule-pipe.js";
import * as noApplicationmodule from "./rules/standalone/no-applicationmodule.js";
import * as noBrowsermodule from "./rules/standalone/no-browsermodule.js";
import * as noBrowsertestingmodule from "./rules/standalone/no-browsertestingmodule.js";
import * as noCdkModules from "./rules/standalone/no-cdk-modules.js";
import * as noCommonmodule from "./rules/standalone/no-commonmodule.js";
import * as noCreatengmodule from "./rules/standalone/no-createngmodule.js";
import * as noMaterialModules from "./rules/standalone/no-material-modules.js";
import * as noNgmodule from "./rules/standalone/no-ngmodule.js";
import * as noPlatformbrowser from "./rules/standalone/no-platformbrowser.js";
import * as noRoutermodule from "./rules/standalone/no-routermodule.js";
import * as noServermodule from "./rules/standalone/no-servermodule.js";
import * as noServiceworkermodule from "./rules/standalone/no-serviceworkermodule.js";
import * as noWithmoduleTesting from "./rules/standalone/no-withmodule-testing.js";
import * as noNgclass from "./rules/styling-bindings/no-ngclass.js";
import * as noNgstyle from "./rules/styling-bindings/no-ngstyle.js";
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
    get standalone() {
      return standalone;
    },
    get functional() {
      return functional;
    },
    get stylingBindings() {
      return stylingBindings;
    },
    get hostBindings() {
      return hostBindings;
    },
    get injectionContext() {
      return injectionContext;
    },
    get dependencyInjection() {
      return dependencyInjection;
    },
    get zoneless() {
      return zoneless;
    },
    get signals() {
      return signals;
    },
    get fetchHttp() {
      return fetchHttp;
    },
    get recommended() {
      return recommended;
    },
  },
  meta: { name, version },
  rules: {
    // Standalone
    [noApplicationmodule.ruleName]: noApplicationmodule.ruleDefinition,
    [noBrowsermodule.ruleName]: noBrowsermodule.ruleDefinition,
    [noBrowsertestingmodule.ruleName]: noBrowsertestingmodule.ruleDefinition,
    [noCommonmodule.ruleName]: noCommonmodule.ruleDefinition,
    [noCreatengmodule.ruleName]: noCreatengmodule.ruleDefinition,
    [noNgmodule.ruleName]: noNgmodule.ruleDefinition,
    [noPlatformbrowser.ruleName]: noPlatformbrowser.ruleDefinition,
    [noRoutermodule.ruleName]: noRoutermodule.ruleDefinition,
    [noServiceworkermodule.ruleName]: noServiceworkermodule.ruleDefinition,
    [noServermodule.ruleName]: noServermodule.ruleDefinition,
    [noWithmoduleTesting.ruleName]: noWithmoduleTesting.ruleDefinition,
    [noMaterialModules.ruleName]: noMaterialModules.ruleDefinition,
    [noCdkModules.ruleName]: noMaterialModules.ruleDefinition,
    // Functional
    [noCanactivateClass.ruleName]: noCanactivateClass.ruleDefinition,
    [noCanactivatechildClass.ruleName]: noCanactivatechildClass.ruleDefinition,
    [noCandeactivateClass.ruleName]: noCandeactivateClass.ruleDefinition,
    [noCanmatchClass.ruleName]: noCanmatchClass.ruleDefinition,
    [noResolveClass.ruleName]: noResolveClass.ruleDefinition,
    [noHttpinterceptorClass.ruleName]: noHttpinterceptorClass.ruleDefinition,
    [noHttpinterceptorsToken.ruleName]: noHttpinterceptorsToken.ruleDefinition,
    [noWithinterceptorsfromdi.ruleName]: noWithinterceptorsfromdi.ruleDefinition,
    // Styling bindings
    [noNgclass.ruleName]: noNgclass.ruleDefinition,
    [noNgstyle.ruleName]: noNgstyle.ruleDefinition,
    // Host bindings
    [noHostbindingDecorator.ruleName]: noHostbindingDecorator.ruleDefinition,
    [noHostlistenerDecorator.ruleName]: noHostlistenerDecorator.ruleDefinition,
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
    // Dependency injection
    [noConstructorInjection.ruleName]: noConstructorInjection.ruleDefinition,
    [noInjectableDecorator.ruleName]: noInjectableDecorator.ruleDefinition,
    [noInjectDecorator.ruleName]: noInjectDecorator.ruleDefinition,
    [noProviderDeps.ruleName]: noProviderDeps.ruleDefinition,
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
    [noAttributeDecorator.ruleName]: noAttributeDecorator.ruleDefinition,
    [noAsyncpipe.ruleName]: noAsyncpipe.ruleDefinition,
    [noDetectchangesTesting.ruleName]: noDetectchangesTesting.ruleDefinition,
    [noChangedetectorref.ruleName]: noChangedetectorref.ruleDefinition,
    [noReactiveForms.ruleName]: noReactiveForms.ruleDefinition,
    // Fetch HTTP
    [noWithxhr.ruleName]: noWithxhr.ruleDefinition,
    [noHttpxhrbackend.ruleName]: noHttpxhrbackend.ruleDefinition,
    [noHttpReportprogress.ruleName]: noHttpReportprogress.ruleDefinition,
    [noHttpReportuploadprogress.ruleName]: noHttpReportuploadprogress.ruleDefinition,
    // Strict standalone
    [noNgmoduleComponent.ruleName]: noNgmoduleComponent.ruleDefinition,
    [noNgmoduleDirective.ruleName]: noNgmoduleDirective.ruleDefinition,
    [noNgmodulePipe.ruleName]: noNgmodulePipe.ruleDefinition,
    // Deprecated
    [noPlatformbrowserdynamic.ruleName]: noPlatformbrowserdynamic.ruleDefinition,
    [noRoutertestingmodule.ruleName]: noRoutertestingmodule.ruleDefinition,
    [noHttpclientjsonpmodule.ruleName]: noHttpclientjsonpmodule.ruleDefinition,
    [noHttpclientmodule.ruleName]: noHttpclientmodule.ruleDefinition,
    [noHttpclienttestingmodule.ruleName]: noHttpclienttestingmodule.ruleDefinition,
    [noHttpclientxsrfmodule.ruleName]: noHttpclientxsrfmodule.ruleDefinition,
    [noBrowseranimationsmodule.ruleName]: noBrowseranimationsmodule.ruleDefinition,
    [noNoopanimationsmodule.ruleName]: noNoopanimationsmodule.ruleDefinition,
    [noCanloadClass.ruleName]: noCanloadClass.ruleDefinition,
    // Experimental
    [noSubscribeInComponentConstructor.ruleName]: noSubscribeInComponentConstructor.ruleDefinition,
  },
} satisfies Plugin;

const standalone: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noApplicationmodule.ruleName}`]: "error",
    [`${name}/${noBrowsermodule.ruleName}`]: "error",
    [`${name}/${noBrowsertestingmodule.ruleName}`]: "error",
    [`${name}/${noCommonmodule.ruleName}`]: "error",
    [`${name}/${noCreatengmodule.ruleName}`]: "error",
    [`${name}/${noNgmodule.ruleName}`]: "error",
    [`${name}/${noPlatformbrowser.ruleName}`]: "error",
    [`${name}/${noRoutermodule.ruleName}`]: "error",
    [`${name}/${noServiceworkermodule.ruleName}`]: "error",
    [`${name}/${noServermodule.ruleName}`]: "error",
    [`${name}/${noWithmoduleTesting.ruleName}`]: "error",
  },
};

const functional: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noCanactivateClass.ruleName}`]: "error",
    [`${name}/${noCanactivatechildClass.ruleName}`]: "error",
    [`${name}/${noCandeactivateClass.ruleName}`]: "error",
    [`${name}/${noCanmatchClass.ruleName}`]: "error",
    [`${name}/${noResolveClass.ruleName}`]: "error",
    [`${name}/${noHttpinterceptorClass.ruleName}`]: "error",
    [`${name}/${noHttpinterceptorsToken.ruleName}`]: "error",
    [`${name}/${noWithinterceptorsfromdi.ruleName}`]: "error",
  },
};

const stylingBindings: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noNgclass.ruleName}`]: "error",
    [`${name}/${noNgstyle.ruleName}`]: "error",
  },
};

const hostBindings: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noHostbindingDecorator.ruleName}`]: "error",
    [`${name}/${noHostlistenerDecorator.ruleName}`]: "error",
  },
};

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

const dependencyInjection: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noConstructorInjection.ruleName}`]: "error",
    [`${name}/${noInjectableDecorator.ruleName}`]: "error",
    [`${name}/${noInjectDecorator.ruleName}`]: "error",
    [`${name}/${noProviderDeps.ruleName}`]: "error",
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
    [`${name}/${noAttributeDecorator.ruleName}`]: "error",
    [`${name}/${noAsyncpipe.ruleName}`]: "error",
    [`${name}/${noReactiveForms.ruleName}`]: "error",
    [`${name}/${noDetectchangesTesting.ruleName}`]: "error",
    [`${name}/${noChangedetectorref.ruleName}`]: "error",
  },
};

const fetchHttp: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    [`${name}/${noWithxhr.ruleName}`]: "error",
    [`${name}/${noHttpxhrbackend.ruleName}`]: "error",
    [`${name}/${noHttpReportprogress.ruleName}`]: "error",
    [`${name}/${noHttpReportuploadprogress.ruleName}`]: "error",
  },
};

const recommended: ConfigObject = {
  plugins: {
    [name]: plugin
  },
  rules: {
    ...standalone.rules,
    ...functional.rules,
    ...stylingBindings.rules,
    ...hostBindings.rules,
    ...injectionContext.rules,
    ...dependencyInjection.rules,
    ...zoneless.rules,
    ...signals.rules,
    ...fetchHttp.rules,
  },
};

export = plugin;