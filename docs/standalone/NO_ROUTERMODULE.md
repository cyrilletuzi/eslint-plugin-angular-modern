# no-routermodule

Restrict the usage of `RouterModule`.

Use `provideRouter()` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Routing guide](https://angular.dev/guide/routing)
- [`provideRouter` API reference](https://angular.dev/api/router/provideRouter)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-routermodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@NgModule({
  imports: [
    RouterModule.forRoot([{ path: 'home', component: HomeComponent }]),
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([{ path: 'home', component: HomeComponent }]),
  ],
};
```

[Back to README](../../README.md)
