# no-serviceworkermodule

Restrict the usage of `ServiceWorkerModule`.

Use `provideServiceWorker()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Service worker guide](https://angular.dev/ecosystem/service-workers/getting-started)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-serviceworkermodule': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    ServiceWorkerModule.register('ngsw-worker.js'),
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker.register('ngsw-worker.js'),
  ],
};
```

[Back to README](../../README.md)
