# Spacer

In most cases, there are gaps between different modules on a page. During development, we often use margins to create these gaps. But for a large-scale project, there may be many scenarios with different gap requirements. If every module had to support margin settings, each module would need related parameters — a lot of repetitive work and not elegant.

The recommended approach is to use spacers. A spacer is a standalone module used solely to add gaps. This way, functional modules don't need to worry about spacing and can be better reused.

## Regular Spacer

Use the `Spacer` module to add vertical gaps. The constructor supports passing a pixel value directly, or one of several preset values.

```ts
// Custom pixel value
new Spacer(24)
// Default, same as not specifying, height is 1rem
new Spacer('normal')
// Preset small, height is 0.5rem
new Spacer('sm')
// Preset large, height is 2rem
new Spacer('lg')
```

## Horizontal Spacer

There is also a horizontal spacer `HSpacer`. Its constructor accepts the same parameters as `Spacer` and can be used to add gaps when organizing horizontal inline elements.

```ts
new HSpacer(33)
new HSpacer('normal')
new HSpacer('sm')
new HSpacer('lg')
```
