---
title: Drawer
order: 170
icon: fa-bars
description: Drawer component usage.
---

# Drawer

The drawer component is an edge-attached panel with simpler options than modal dialogs. It is suitable for displaying menus or prompts.

## Basic Usage

Build and display a drawer module using the `showDrawer` function.

```ts
showDrawer({
  title: 'Title (optional)',
  body: 'Content to display',
  onClose() {
    showWarning('The drawer has been closed')
  }
})
```

Drawers do not currently support footer buttons — you can customize them within the body if needed. They also do not support full-screen overlay and static backdrop features like modals.

### Drawer Without Title

The `title` is optional — omit it to hide the title bar.

```demo ../demos/drawer/no-title.ts
```

## Placement

Use the `placement` option to control where the drawer appears.

```ts
showDrawer({
  title: 'Top',
  // 'left' | 'right' | 'top' | 'bottom'
  placement: 'top',
  body: 'Will slide in from the top'
})
```

```demo ../demos/drawer/placement.ts
```

### Custom Width

Use the `width` option to customize the drawer width. It only works for left and right drawers.

```demo ../demos/drawer/width.ts
```

## Handle Control

Like modals, the `showDrawer` function returns an object with a `close` method, which can be used to close the drawer programmatically.

```ts
const drawer = showDrawer({
  placement: 'left',
  body: new Button({
    text: 'Click to close drawer',
    onClick(ev) {
      drawer.close()
    }
  })
})
```

```demo ../demos/drawer/handle-close.ts
```

## Stacked Drawers

Multiple drawers can be stacked. Clicking the backdrop closes them one by one in reverse order of opening.

```demo ../demos/drawer/stacked.ts
```

## Fully Customized Content

Set `replaceByBody: true` to let the body replace the entire drawer content area, suitable for highly customized scenarios.

```demo ../demos/drawer/custom-body.ts
```

## Embedded Form

A form can be embedded in the drawer, and the `onShown` callback can auto-focus the input after the entrance animation completes.

```demo ../demos/drawer/with-form.ts
```
