# Icon

The component library provides the `SvgIcon` type to encapsulate SVG icons for programmatic use in modules.

## Basic Usage

To define a custom icon, create a module class that extends `SvgIcon`.

```ts
class IconSuccess extends SvgIcon {
  constructor() {
    // The parent constructor accepts an SVG code string
    super(
      `<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>`
    )
  }
}
```

`SvgIcon` has two methods: `setSize` and `setColor`, for setting the size and color respectively.

```ts
// Create an instance of a custom icon and set its color and size
new IconSuccess().setSize(18).setColor(getColor().success)
```

## Remote Icons

If a project has a large number of icons, packaging them directly may cause bloated bundle sizes and slow loading. The library provides the `RemoteSvgIcon` type for handling remote icons. Unlike `SvgIcon`, the `RemoteSvgIcon` constructor accepts an icon URL, and the icon file is loaded on demand. The icon must be in SVG format.

```ts
class IconAlarm extends RemoteSvgIcon {
  constructor() {
    super('/wok-ui/icons/alarm.svg')
  }
}
```

`RemoteSvgIcon` also has `setSize` and `setColor` methods with the same functionality as `SvgIcon`.
