# custom-function-in-injection-context

Checks that a function is called inside an injection context, or that ax explicit injection context is provided as an argument, to avoid the `NG0203` runtime error.

## Documentation

- Check the documentation of the specific function
- [General injection context guide](https://angular.dev/guide/di/dependency-injection-context)
- [`NG0203` runtime error](https://angular.dev/errors/NG0203)

## Configuration

- `functions`: array of configuration objects of the functions to check
  - `name`: name of the function to check, for example 'customInject' (required)
  - `argumentPosition`: 0-based position of the argument in which it is possible to pass an explicit injection context; if not provided, the function will only be allowed in injection context
  - `argumentPropertyName`: if the explicit injection context argument is an object, the name of the property, for example 'injector'; if not provided, the rule will consider the argument is directly the explicit injection context
  - `allowedSpecialInjectionContexts`: array of special injection contexts to allow: `routing`, `http`, `factory`, `asyncApplicationInitialization`, `syncApplicationInitialization` (see valid cases below)

For example, if the custom function looks like this:
```typescript
function myCustomOperator(destroyRef: DestroyRef): void {
  if (!destroyRef) {
    assertInInjectionContext(myCustomOperator);
  }
  destroyRef ??= inject(DestroyRef);
}
myCustomOperator(); // in injection context
myCustomOperator(destroyRef); // outside injection context
```

...the configuration would be:
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/custom-function-in-injection-context': ['error', {
      functions: [{
        name: 'myCustomOperator',
        argumentPosition: 0
      }]
    }]
  }
}
```

For example, if the custom function looks like this:
```typescript
function myCustomOperator(data: string, { injector }: { injector: Injector } = {}): void {
  if (!injector) {
    assertInInjectionContext(myCustomOperator);
  }
  const router = injector ? injector.get(Router) : inject(Router);
}
myCustomOperator(); // in injection context
myCustomOperator('test', { injector }); // outside injection context
```

...the configuration would be:
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/custom-function-in-injection-context': ['error', {
      functions: [{
        name: 'myCustomOperator',
        argumentPosition: 1,
        argumentPropertyName: 'injector'
      }]
    }]
  }
}
```

Multiple functions can be configured.

## ❌ Invalid

- in lifecycle methods, notably `ngOnInit`
```typescript
@Component()
export class ProductPage implements OnInit {
  ngOnInit(): void {
    myCustomOperator();
  }
}
```

- in any methods other than the constructor
```typescript
@Component({
  template: `<form (submit)="save()"></form>`
})
export class ProductEditPage {
  save(): void {
    myCustomOperator();
  }
}
```

- in callbacks
```typescript
@Component() 
export class ProductPage {
  constructor() {
    somePromise.then(() => {
      myCustomOperator();
    }).catch(() => {});
  }
}
```

> [!NOTE]
> The rule reports both on asynchronous and synchronous callbacks, see the [known limitation documentation](./known-limitations/CALLBACKS.md).

- after awaiting (which is equivalent to be in a `.then()` callback)
```typescript
const myGuard: CanActivateFn = async () => {
  await someAsyncFunction();
  myCustomOperator();
  return true;
};
```

- in non-Angular classes
```typescript
export class Product {
  private readonly example = myCustomOperator();
}
```

- in standalone functions
```typescript
function someFunction(): void {
  myCustomOperator();
} 
```

## ✅ Valid

### Common cases

These cases are always allowed.

- in constructors of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductsPage {
  constructor() {
    myCustomOperator();
  }
}
```

- in property initializers of components, directives, pipes and injectables/services
```typescript
@Component()
export class ProductPage {
  private readonly example = myCustomOperator();
}
```

- in explicit injection context
```typescript
@Injectable({ providedIn: 'root' })
export class MyService {
  private readonly environmentInjector = inject(EnvironmentInjector);

  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      myCustomOperator();
    });
  }
}
```

> [!NOTE]
> The rule only detects `runInInjectionContext()` or `TestBed.runInInjectionContext()` in the current function, see the [known limitation documentation](./known-limitations/RUN_IN_INJECTION_CONTEXT.md).

- when asserted
```typescript
function otherCustomOperator(destroyRef?: DestroyRef) {
  if (!destroyRef) {
    assertInInjectionContext(customOperator);
  }
  myCustomOperator();
}
```

### Routing

These cases are allowed for this configuration:
```javascript
{
  allowedSpecialInjectionContexts: ['routing']
}
```

> [!TIP]
> If the custom function is RxJS-related (for example by returning an `Observable` or an operator), this context should probably be enabled as routing features allows to return an `Observable`.

- in guards and resolvers
```typescript
const authGuard: CanActivateFn = () => {
  myCustomOperator();
  return true;
};
```

- in routes options involving a function:
```typescript
export const routes: Routes = [{
  path: 'some/path',
  redirectTo: () => {
    myCustomOperator();
    return '/some/path';
  },
}];
```

> [!NOTE]
> For some route options, injection context is only available from certain Angular versions, see the [known limitation documentation](./known-limitations/ROUTE_OPTIONS.md).

### HTTP

These cases are allowed for this configuration:
```javascript
{
  allowedSpecialInjectionContexts: ['http']
}
```

> [!TIP]
> If the custom function is RxJS-related (for example by returning an `Observable` or an operator), this context should probably be enabled as HTTP features allows to return an `Observable`.

- in interceptors
```typescript
const authInterceptor: HttpInterceptorFn = () => {
  myCustomOperator();
};
```

### Factories

These cases are allowed for this configuration:
```javascript
{
  allowedSpecialInjectionContexts: ['factory']
}
```

> [!TIP]
> If the custom function is asynchronous (`Promise` or `Observable`), this context should probably _not_ be enabled, as factories must be synchronous.

- in injection tokens
```typescript
const MY_TOKEN = new InjectionToken('my-token', {
  factory: () => {
    myCustomOperator();
    return 'data';
  },
});
```

- in providers and injectables factories
```typescript
const provider: Provider = {
  provide: SOME_TOKEN,
  useFactory: () => {
    myCustomOperator();
    return 'data';
  },
};
```

### Async application initialization

These cases are allowed for this configuration:
```javascript
{
  allowedSpecialInjectionContexts: ['asyncApplicationInitialization']
}
```

> [!TIP]
> If the custom function is RxJS-related (for example by returning an `Observable` or an operator), this context may be enabled as it allows to return an `Observable`.

- in some providers during app initialization:
  - `provideAppInitializer()`

### Sync application initialization

These cases are allowed for this configuration:
```javascript
{
  allowedSpecialInjectionContexts: ['syncApplicationInitialization']
}
```

> [!TIP]
> Except if the custom function is dedicated to these very special contexts, this option should probably _not_ be enabled. 

- in some providers during app initialization:
  - `providePlatformInitializer()`
  - `provideEnvironmentInitializer()`
  - `withViewTransitions()` `onViewTransitionCreated`

[Back to README](../../README.md)
