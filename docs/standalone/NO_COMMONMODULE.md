# no-commonmodule

Restrict the usage of `CommonModule`.

Use the new control flow syntax instead and standalone pipes instead.

## Documentation

- [Standalone migration](https://angular.dev/reference/migrations/standalone)
- [Control flow guide](https://angular.dev/guide/templates/control-flow)
- [Pipes guide](https://angular.dev/guide/templates/pipes)

## Configuration

- in the `recommended` preset
- in the `standalone` preset
- or just this rule:

```json
{
  "rules": {
    "eslint-plugin-angular-modern/no-commonmodule": "error"
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
@Component({
  imports: [CommonModule],
  template: `
    <div *ngIf="someCondition()">{{ someDate() | date }}</div>
  `,
})
export class SomeComponent {
  protected readonly someCondition = signal(false);
  protected readonly someDate = signal(new Date());
}
```

## ✅ Valid

```typescript
@Component({
  imports: [DatePipe],
  template: `
    @if (someCondition()) {
      <div>{{ someDate() | date }}</div>
    }
  `,
})
export class SomeComponent {
  protected readonly someCondition = signal(false);
  protected readonly someDate = signal(new Date());
}
```

[Back to README](../../README.md)
