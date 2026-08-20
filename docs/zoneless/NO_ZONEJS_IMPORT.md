# no-zonejs-import

Restrict the import of `zone.js`.

> [!NOTE]
> Most of the time, `zone.js` is imported via `angular.json` configuration, and this rule cannot detect that.

## Configuration

- in the `recommended` preset
- in the `zoneless` preset
```javascript
{
  rules: {
    'eslint-plugin-angular-modern/no-zonejs-import': 'error'
  }
}
```

> [!TIP]
> See the [README](../../README.md) for the global and presets configuration.

## ❌ Invalid

```typescript
import 'zone.js';
```

[Back to README](../../README.md)
