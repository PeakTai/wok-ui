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

Buttons are also widely used by many other built-in components such as modal dialogs.
