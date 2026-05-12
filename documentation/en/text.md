# Text

The library provides the `Text` type for building basic text, along with a set of preset text types.

## Presets

Preset objects can be used directly — simple and convenient, suitable for common application scenarios.

| Preset Type            | Description                       |
| :--------------------- | :-------------------------------- |
| PrimaryBodyText        | Primary body text                 |
| SecondaryBodyText      | Secondary body text               |
| SmallSecondaryBodyText | Small secondary body text         |
| Title                  | Title, corresponds to h2 tag      |
| LargeTitle             | Large title, corresponds to h1 tag|

Example:

```ts
createDomModule({
  children: [
    new LargeTitle('Page Title'),
    16,
    new PrimaryBodyText('Body content'),
    'Default text from a string, unlike body text, is affected by the parent element\'s styles'
  ]
})
```

## Text

If you need more text configuration, use the `Text` type.

```ts
new Text({
  // Generated tag, default is span
  tag: 'span',
  // Text content
  text: 'Text content',
  // Bold
  bold: true,
  // Color, using the primary theme color here
  color: getColor().primary,
  // Click event
  onClick(ev) {
    ev.preventDefault()
    // TODO handle click event
  }
})
```

All options except `text` are optional.

The preset types mentioned above are all subclasses of `Text`. `Text` also supports chaining, which can be handy for quickly modifying a preset type.

```ts
new PrimaryBodyText('Highlighted text').setColor(getColor().primary)
```
