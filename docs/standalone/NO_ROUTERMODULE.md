# no-routermodule

Restrict the usage of `RouterModule`.

Use `provideRouter()` or `RouterLink` instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Routing guide](https://angular.dev/guide/routing)
- [`provideRouter` API reference](https://angular.dev/api/router/provideRouter)
- [`RouterLink` API reference](https://angular.dev/api/router/RouterLink)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-routermodule': 'error'
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

```typescript
@Component({
  imports: [RouterModule],
  template: `
    <a routerLink="/path/to/some/page">Link</a>
  `,
})
export class SomeComponent {}
```

## ✅ Valid

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([{ path: 'home', component: HomeComponent }]),
  ],
};
```

```typescript
@Component({
  imports: [RouterLink],
  template: `
    <a routerLink="/path/to/some/page">Link</a>
  `,
})
export class SomeComponent {}
```

[Back to README](../../README.md)
