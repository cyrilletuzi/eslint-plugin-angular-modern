# Design choices

## Recommended preset

Recommended presets in lint packages are often a mess: it is commonly opaque or unclear why a rule is or is not inside the recommended preset, and generally the decision is done more or less arbitrarily by one individual. From the user side, it makes things really difficult, because each rule must be searched and inspected one by one to see if it is already in the recommended preset or not, and if not, if it should be enabled or not.

In this package, the philosophy is: **if a rule is relevant to be created, it should be in the recommended preset**. Otherwise, it probably means the rule is not relevant enough to be created at all.

It means that **nearly all rules are in the `recommended` preset**, so the configuration is minimal.

There are a few exceptions, to respect the performance goal mentionned below:

- while most rules are about Angular itself, some are for additional libraries (for example Material): as the usage of these libraries is specific to each project, their related rules must be enabled individually, to avoid useless checks

- to avoid redundant checks, rules about things which can already be reported by existing ESLint or TypeScript ESLint rules (especially the `@typescript-eslint/no-deprecated` one) or by Angular compiler options are not enabled by default

## Features presets

Some lint packages group rules by categories, for example `correctness`, `style`... They fall into the same problems as the `recommended` preset.

In this package, **a preset is a group of rules targeting a specific feature**, for example `standalone` to ban NgModules.

## Performance

In the today state of development, where AI tools have a central place, **the lint performance is a priority**.

**A lint rule should only be as precise as the actual usage requires it**, instead of being as accurate as possible just to match a theorical precision.

For example, banning `NgClass` is just done by detecting identifiers called `NgClass`, and that is all. In a theorical world, precision would require to check it is a `NgClass` coming from `@angular/common`. But in practice, this level of precision is useless, because it is very unlikely something else is called `NgClass`.

For the same reason, [typed linting](https://typescript-eslint.io/getting-started/typed-linting) is avoided as much as possible.

## Legacy

One of the main goals of this lint package is to ban legacy Angular features. But **what is considered legacy? Any feature for which a new stable API has been introduced to achieve the same goal but in a new way.**

Some may argue that some features are not legacy and are still supported. I work with the modern Angular since its alpha version, so more than 10 years now, and I learned one thing: the cake is a lie. For many reasons, the Angular team has to be careful about how they communicate about changes. But let us take an example: dependency injection. At first, the official message from the documentation was "both constructor-based injection and `inject()` are OK". But quietly and quite quickly, the constructor-based injection has disappeared from the documentation and `inject()` is now enforced by default by Angular ESLint. It has been the same story for every feature.

One may disagree, and that is OK. Then, just do not use the presets aimed at banning legacy features. But **it is useless to start debates about this in issues or discussions, they will be closed right away.**

[Back to README](../README.md)
