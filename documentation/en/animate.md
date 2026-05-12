# Animation

The library provides a set of commonly used animation effects. By calling the `animate` function, you can make a specified DOM element display the corresponding animation. Animations are used in many places within built-in modules.

## Basic Usage

Make an element slide in from the top:

```ts
animate({
  el,
  // Specify the animation as SLIDE_TOP
  animation: Animation.SLIDE_TOP,
  // Duration in milliseconds, i.e., 3 seconds
  duration: 3000
})
```

The `animation` option is an `Animation` enum value. All supported animations are listed below:

| Enum Value             | Description       |
| :--------------------- | :---------------- |
| Animation.FADE         | Fade in           |
| Animation.SCALE_UP     | Scale up and enter|
| Animation.SCALE_DOWN   | Scale down        |
| Animation.SLIDE_TOP    | Slide in from top |
| Animation.SLIDE_BOTTOM | Slide in from bottom |
| Animation.SLIDE_LEFT   | Slide in from left |
| Animation.SLIDE_RIGHT  | Slide in from right |
| Animation.SHAKE        | Shake             |

## Reverse Animation

Setting the `reverse` option to `true` makes the animation play in reverse, commonly used for exit animations. For example, if an element entered by sliding from the top, calling `animate` again with the `reverse` option on exit makes the element slide out upward. The same applies to fade in/out. However, reverse has no effect on shake (`Animation.SHAKE`).

```ts
// Make an element that entered from the top exit back to the top
animate({
  el,
  animation: Animation.SLIDE_TOP,
  duration: 3000,
  reverse: true
})
```

## Hiding Before Entry

If an element is already visible and you then call `animate` for an entry animation, the screen will flicker and jump. The element must be hidden beforehand so it only appears when the entry animation executes. Add the class `animation-provision` to the element to hide it — `animate` will automatically remove this class when called. Use the constant `ANIMATION_PROVISION` for this.

Here's an example in a module:

```ts
class Modal extends DivModule {
  constructor() {
    // Add the hiding class
    super(ANIMATION_PROVISION, 'modal')
    this.addChild({
      className: 'header',
      children: [
        // Building content omitted...
      ]
    })
  }

  mount(parentEl: Element): void {
    super.mount(parentEl)
    // Entry animation
    animate({
      el: this.el,
      animation: Animation.SLIDE_TOP,
      duration: 800
    })
  }

  destroy(): void {
    // Exit animation
    animate({
      el: this.el,
      animation: Animation.SLIDE_TOP,
      duration: 800,
      reverse: true
    }).then(() => {
      super.destroy()
    })
  }
}
```
