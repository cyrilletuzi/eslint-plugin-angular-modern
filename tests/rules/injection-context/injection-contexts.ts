/**
 * Shared cases to check which injection contexts are accepted by each injection context rule.
 *
 * The detection logic itself is exhaustively tested in `inject-in-injection-context.test.ts`:
 * here, the call is always placed in a simple position, the goal is only to check which special contexts are enabled.
 */

export interface SpecialInjectionContexts {
  readonly routing?: boolean;
  readonly http?: boolean;
  readonly factories?: boolean;
  readonly asyncAppInitialization?: boolean;
  readonly syncAppInitialization?: boolean;
}

type Errors = ({ messageId: string } | { message: string })[];

interface Cases {
  valid: string[];
  invalid: { code: string, errors: Errors }[];
}

/**
 * @param call Code of the call to check, for example `effect(() => {})`
 * @param enabled Special injection contexts enabled for the rule
 * @param errors Expected errors when reported
 */
export function injectionContextsCases(call: string, enabled: SpecialInjectionContexts, errors: Errors): Cases {
  const alwaysValid = [
    // Class initialization
    `@Component() class C { a = ${call}; }`,
    `@Directive() class C { a = ${call}; }`,
    `@Injectable() class C { a = ${call}; }`,
    `@Pipe({ name: 'p' }) class C { a = ${call}; }`,
    `@NgModule() class C { a = ${call}; }`,
    `@Service() class C { a = ${call}; }`,
    `@Component() class C { constructor() { ${call}; } }`,
    // Functions with injection context
    `runInInjectionContext(injector, () => { ${call}; });`,
    `TestBed.runInInjectionContext(() => { ${call}; });`,
    // Asserted injection context
    `function f() { assertInInjectionContext(f); ${call}; }`,
  ];

  const alwaysInvalid = [
    `${call};`,
    `function f() { ${call}; }`,
    `class C { a = ${call}; }`,
    `@Component() class C { ngOnInit() { ${call}; } }`,
    `@Component() class C { constructor() { setTimeout(() => { ${call}; }); } }`,
    `runInInjectionContext(injector, async () => { await something(); ${call}; });`,
  ];

  const specialContexts: readonly (readonly [keyof SpecialInjectionContexts, readonly string[]])[] = [
    ["routing", [
      `const f: CanActivateFn = () => { ${call}; return true; };`,
      `const f: CanActivateChildFn = () => { ${call}; return true; };`,
      `const f: CanDeactivateFn<C> = () => { ${call}; return true; };`,
      `const f: CanMatchFn = () => { ${call}; return true; };`,
      `const f: ResolveFn<D> = () => { ${call}; return true; };`,
      `const f: RunGuardsAndResolvers = () => { ${call}; return true; };`,
      `const f: LoadChildren = () => { ${call}; return true; };`,
      `const f: LoadChildrenCallback = () => { ${call}; return true; };`,
      `@Injectable() class G implements CanActivate { canActivate() { ${call}; return true; } }`,
      `@Injectable() class G implements CanActivateChild { canActivateChild() { ${call}; return true; } }`,
      `@Injectable() class G implements CanDeactivate<C> { canDeactivate() { ${call}; return true; } }`,
      `@Injectable() class G implements CanMatch { canMatch() { ${call}; return true; } }`,
      `@Injectable() class G implements Resolve<D> { resolve() { ${call}; return true; } }`,
      `const routes: Routes = [{ path: '', canActivate: [() => ${call}] }];`,
      `const route: Route = { path: '', canActivate: [() => ${call}] };`,
    ]],
    ["http", [
      `const i: HttpInterceptorFn = (req, next) => { ${call}; return next(req); };`,
      `@Injectable() class I implements HttpInterceptor { intercept(req, next) { ${call}; return next.handle(req); } }`,
    ]],
    ["factories", [
      `const p = { provide: T, useFactory: () => ${call} };`,
      `const T = new InjectionToken('t', { factory: () => ${call} });`,
      `@Injectable({ providedIn: 'root', useFactory: () => ${call} }) class S {}`,
      `@Service({ factory: () => ${call} }) class S {}`,
    ]],
    ["asyncAppInitialization", [
      `provideAppInitializer(() => { ${call}; });`,
    ]],
    ["syncAppInitialization", [
      `providePlatformInitializer(() => { ${call}; });`,
      `provideEnvironmentInitializer(() => { ${call}; });`,
      `withViewTransitions({ onViewTransitionCreated: () => { ${call}; } });`,
      `provideWebMcpTools(() => { ${call}; });`,
      `const o: ViewTransitionsFeatureOptions = { onViewTransitionCreated: () => { ${call}; } };`,
    ]],
  ];

  const valid = [...alwaysValid];
  const invalid = [...alwaysInvalid];

  for (const [specialContext, codes] of specialContexts) {
    (enabled[specialContext] === true ? valid : invalid).push(...codes);
  }

  return {
    valid,
    invalid: invalid.map((code) => ({ code, errors })),
  };
}

/**
 * Cases for functions accepting an explicit injection context in an object argument property, like `{ injector }`.
 * All cases are outside of an injection context.
 *
 * @param build Builds the call with the given code as the argument at the right position
 * @param propertyName Name of the property, for example `injector`
 * @param errors Expected errors when reported
 */
export function objectArgumentCases(build: (argument: string) => string, propertyName: string, errors: Errors): Cases {
  return {
    valid: [
      build(`{ ${propertyName} }`),
      build(`{ ${propertyName}: this.${propertyName} }`),
      build(`{ other: true, ${propertyName} }`),
      build(`{ ...others, ${propertyName} }`),
      // Quoted key
      build(`{ '${propertyName}': value }`),
      // Computed key with the same identifier name (edge case)
      build(`{ [${propertyName}]: value }`),
      // KNOWN LIMITATION: options in a variable are supposed to contain the property
      build(`options`),
    ],
    invalid: [
      build(`{}`),
      build(`{ other: true }`),
      build(`{ ...options }`),
      build(`this.options`),
      build(`getOptions()`),
    ].map((code) => ({ code, errors })),
  };
}

/**
 * Add the import of the checked function to all cases, as rules only check functions imported from Angular.
 *
 * @param importDeclaration Import of the checked function, for example `import { effect } from "@angular/core";`
 * @param cases Cases to complete
 */
export function withImport(importDeclaration: string, cases: Cases): Cases {
  return {
    valid: cases.valid.map((code) => `${importDeclaration}\n${code}`),
    invalid: cases.invalid.map((testCase) => ({ ...testCase, code: `${importDeclaration}\n${testCase.code}` })),
  };
}
