# Size

The library has unified size management. Each size has a corresponding CSS variable, and all built-in components apply this size configuration.

## Units

All size-related properties in built-in components use pixels (px). This is because DOM interfaces all work in pixels — using a consistent unit makes encapsulation easier.

The library provides a `rem` function for converting rem units.

```ts
createDomModule({
  children: ['First line of text', rem(1), 'Second line, 1rem gap from the first']
})
```

## CSS Variables

| CSS Variable         | Property Name | Meaning                          |
| :------------------- | :------------ | :------------------------------- |
| --size-text          | text          | Default text size, default 1rem  |
| --size-text-sm       | textSm        | Small text size, default 0.75rem |
| --size-text-lg       | textLg        | Large text size, default 1.25rem |
| --size-text-xl       | textXl        | Extra large text, default 1.5rem |
| --size-border-radius | borderRadius  | Border radius, default 0.375rem  |

## Updating Size Settings

Use the `setSize` function to change the default settings.

```ts
setSize({
  text: 16,
  textSm: 14,
  textLg: 18,
  textXl: 22,
  borderRadius: 5
})
```

After calling `setSize`, CSS variables are updated immediately. Some modules may change instantly, but implementations that depend on the API will not respond immediately — it's best to re-render.

Since this operation is risky and misuse can cause chaos, the library provides the `resetSize` function to restore defaults when needed.

## Getting Size Information

Use the `getSize` function to get the current size information.

```ts
// Get the default text size
const { text } = getSize()
```
