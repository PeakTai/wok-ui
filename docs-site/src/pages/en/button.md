---
title: Button
order: 110
icon: fa-hand-pointer
description: Button types, sizes, and events.
---

# Button

The button is the most commonly used interactive element on a page. For a web application, the vast majority of user actions are triggered by clicking, so the component library provides a rich set of button styles.

## Usage

Create a button by constructing a `Button` instance.

```ts
new Button({
  // Button text
  text: 'Get Started!',
  // Type — primary (theme color)
  type: 'primary',
  // Outline style; defaults to false (filled style)
  outline: true,
  // Size
  size: 'lg',
  // Handle click events
  onClick(ev) {
    // TODO: interaction logic
  }
})
```

### Button Types

Use `type` to set the purpose of a button.

```demo ../demos/button/types.ts
```

### Outline Style

Set `outline: true` to use the outline (hollow) style, which suits scenarios with a filled background.

```demo ../demos/button/outline.ts
```

### Disabled

```demo ../demos/button/disabled.ts
```

### With Icon

Use `icon` to set an icon and `iconPosition` to control its position.

```demo ../demos/button/icon.ts
```

### Sizes

Use `size` to set the size. Supports `lg` and `sm`; medium is the default.

```demo ../demos/button/size.ts
```

### Block Button

Set `block: true` to make the button fill the entire row.

```demo ../demos/button/block.ts
```

Buttons are also widely used by many other built-in components such as modal dialogs.
