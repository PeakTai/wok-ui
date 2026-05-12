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
