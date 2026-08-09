# Synchronous callbacks

This known limitation is a false negative.

For some route options, the injection context is only available from certain Angular versions:
- `loadComponent`: Angular >= 20.1
- `loadChildren`: Angular >= 20.1
- `runGuardsAndResolvers`: Angular >= 21.1

The lint rules are not aware of the Angular version, so they will not report errors in previous versions.

[Back to README](../../../README.md)
