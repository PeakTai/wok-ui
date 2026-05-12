# Layout

To make layout tasks easier, the component library provides several built-in layout modules covering most common layout needs.

## Horizontal Box

Use `HBox` to quickly build a container that stacks elements horizontally.

```ts
new HBox({
  // Gap between elements: 1rem
  gap: rem(1),
  // Child modules to stack
  children: [
    'Batch operations:',
    new Button({ text: 'Activate' }),
    new Button({ text: 'Freeze' }),
    new Button({ text: 'Delete' })
  ],
  // Allow wrapping when a row overflows
  wrap: true,
  // Vertically center-align items
  align: 'center'
})
```

## Vertical Box

Use `VBox` to quickly build a container that stacks elements vertically. By default, block-level elements stack top-to-bottom, so `VBox` is rarely needed — it is only suitable for certain edge cases.

```ts
new VBox({
  // Gap between elements: 1rem
  gap: rem(1),
  // Stretch alignment across the cross-axis
  align: 'stretch',
  // Child modules to stack vertically
  children: [
    new Link({ content: 'Hot News' }),
    new Link({ content: 'Code Life' }),
    new Link({ content: 'Utilities' }),
    new Link({ content: 'AI' })
  ]
})
```

## Justify Box

Use `JustifyBox` to quickly build a container that distributes two or more elements with space between them.

```ts
new JustifyBox({
  align: 'top',
  children: [
    { children: ['79', rem(1), 'Articles'] },
    { children: ['163k', rem(1), 'Reads'] },
    { children: ['256', rem(1), 'Followers'] }
  ]
})
```

## Vertical Split Box

Use `VSplitBox` to quickly build a vertically split container. It accepts two child modules — one with a fixed height and the other filling the remaining space. The container must have a specified height.

```ts
new VSplitBox({
  // Container height
  height: window.innerHeight,
  // Fixed side at the top
  fixedSide: 'top',
  // Top (fixed height)
  top: { classNames: 'header', innerText: 'Online Learning Admin' },
  // Bottom (stretched to fill remaining space)
  bottom: {
    classNames: 'body',
    children: [
      //...
    ]
  }
})
```

## Horizontal Split Box

Use `HSplitBox` to quickly build a horizontally split container. It accepts two child modules — one with a fixed width and the other filling the remaining space.

```ts
new HSplitBox({
  // Gap: 12px
  gap: 12,
  // Align to top
  align: 'top',
  // Fixed side on the left
  fixedSide: 'left',
  // Left content (fixed width)
  left: { classNames: 'avatar', tag: 'img', attrs: { src: 'avatar-url' } },
  // Right content
  right: {
    classNames: 'comment',
    children: ['John Doe · 6 minutes ago', rem(0.5), 'Great article, thumbs up!']
  }
})
```

## Grid

Use `Grid` to quickly build a grid with a specified number of columns, ideal for list layouts.

```ts
new Grid({
  // 6 columns per row
  cols: 6,
  // Gap between cells
  gap: 12,
  // Minimum cell width: 200px, prevents severe distortion in edge cases
  // May override the 6-column setting. If each cell in a 6-column row
  // would be less than 200px, items wrap early.
  cellMinWidth: 200,
  // Content of each cell
  cells: [
    { classNames: 'item', children: ['Thinking in Java (4th Edition)', 'Published: 2007-6'] },
    { classNames: 'item', children: ['Linux Programming (4th Edition)', 'Published: 2010-6'] }
    // ......
  ]
})
```
