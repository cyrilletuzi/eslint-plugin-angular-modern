# no-ionicmodule

Restrict the usage of `IonicModule`.

Use standalone components and directives instead, and \`provideIonicAngular()\` for initialization.

## Documentation

- [Ionic components documentation](https://ionicframework.com/docs/components)

## Configuration

```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-ionicmodule': 'error'
  }
}
```

> [!NOTE]
> This rule must be enabled individually and is not enabled in the `standalone` or `recommended` presets because not all projects use Ionic.

## ❌ Invalid

```typescript
@Component({
  imports: [IonicModule],
  template: `<ion-button>Button</ion-button>`,
})
export class SomeComponent {}
```

```typescript
@NgModule({
  imports: [
    IonicModule.forRoot({}),
  ],
})
export class AppModule {}
```

## ✅ Valid

```typescript
@Component({
  imports: [IonButton],
  template: `<ion-button>Button</ion-button>`,
})
export class SomeComponent {}
```

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular({}),
  ],
};
```

[Back to README](../../README.md)
