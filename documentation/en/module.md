# Module

A module is a reusable unit that encapsulates one or more DOM elements. Its purpose is to enable rapid reuse of common DOM compositions, such as tables. Consider the alternative: writing deeply nested, complex HTML code every time you use a modal dialog — tedious and error-prone. Modules encapsulate these HTML compositions so they can be quickly reused, avoiding repetitive HTML coding.

Modules are object-oriented. Each module is a class, with module-related operations contained within the class. Internal properties maintain the module's state and information, exposing only necessary properties and methods externally. Modules are still DOM-based internally, but the DOM is not exposed externally. External code must not directly modify a module's internal DOM, especially its styles.

## Module

`Module` is the base class (abstract, cannot be instantiated directly). You can create a custom module by extending `Module`. The `Module` constructor requires an `HTMLElement` parameter.

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
  }
}
```

`Module` exposes the `el` property to subclasses — the `HTMLElement` instance passed during construction — allowing subclasses to perform custom DOM operations.

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
    this.el.classList.add('custom')
  }
}
```

`Module` provides several internal methods for building content, available only to subclasses. Below are some commonly used methods:

| Method       | Description                             |
| :----------- | :-------------------------------------- |
| addChild     | Add a new child module                  |
| insertChild  | Insert a child module at a position     |
| moveChild    | Move a child module                     |
| find         | Find child modules                      |
| findFirst    | Find the first matching child module    |
| empty        | Clear all child modules                 |

In most cases, only `addChild` is needed. Expanding on the example above, let's add some text:

```ts
class CustomModule extends Module {
  constructor() {
    super(document.createElement('div'))
    // Add a line of text. Text is a built-in basic module, introduced later.
    this.addChild(new Text('Hello World !'))
  }
}
```

`Module` also provides public methods, the most common being `mount` and `destroy`, for mounting and destroying respectively.

Use the `mount` method to mount a custom module onto the body for display:

```ts
new CustomModule().mount(document.body)
```

By overriding `mount` and `destroy`, you can perform additional operations when the module is mounted or destroyed, such as cleaning up resources on destroy.

```ts
/**
 * Countdown module
 */
class CountDownModule extends Module {
  timerId = 0
  count = 100

  mount(parentEl: Element): void {
    this.timerId = setInterval(() => {
      this.count--
      this.el.innerText = this.count + ''
      if (this.count <= 0) {
        clearInterval(this.timerId)
        this.timerId = 0
      }
    }, 1000)
    super.mount(parentEl)
  }

  destroy(): void {
    if (this.timerId) clearInterval(this.timerId)
    super.destroy()
  }
}
```

## DivModule

For convenience, the library provides a concrete module class `DivModule`, which simply passes a `div` element by default when building a module. The `DivModule` constructor accepts a set of CSS class names. Extending `DivModule` makes it easier to build `div`-based modules.

```ts
class CustomModule extends DivModule {
  constructor() {
    super('container', 'px-5')
  }
}
```

## Types Convertible to Module

Many types can be converted to modules. In places where a module is expected, you can directly use these types, and they will be automatically converted internally. This brings great convenience and saves effort.

| Type          | Converted Module Type                                            |
| :------------ | :--------------------------------------------------------------- |
| string        | Text                                                             |
| number        | Spacer, adds vertical gap                                        |
| HTMLElement   | Module created from element                                      |
| () => Module  | Module returned after function execution, suitable for lazy construction |

For example, the `addChild` method mentioned earlier supports all these types:

```ts
class CustomModule extends DivModule {
  constructor() {
    super()
    this.addChild(
      'First line of text',
      16,
      'Second line of text',
      16,
      'Third line of text',
      16,
      document.createElement('hr'),
      16,
      'Separated second part'
    )
  }
}
```

Almost all built-in features of the library support this. If you want your custom components to support it, use the provided type `ConvertibleModule` and the `convertToModule` function.

```ts
class Layout extends DivModule {
  constructor(content: ConvertibleModule) {
    super()
    this.addChild(convertToModule(content))
    // In fact, addChild already accepts ConvertibleModule directly
    this.addChild(content)
  }
}
```

If you need to receive a group of modules, the library also provides the `SubModulesOpt` type and the conversion function `buildSubModules`. `SubModulesOpt` can be seen as an array of `ConvertibleModule`, with additional features introduced later.

```ts
class List extends DivModule {
  constructor(items: SubModulesOpt) {
    super()
    // Use buildSubModules to convert SubModulesOpt to an array of modules
    this.addChild(...buildSubModules(items))
  }
}

new List(['Item 1', 'Item 2', 'Item 3'])
```

## createDomModule

If a module is complex, with many levels and many elements, internal code requires a lot of add operations. You can use `createDomModule` to quickly create an anonymous module for building content.

```ts
class Modal extends DivModule {
  constructor() {
    super('modal', 'fade')
    this.addChild(
      createDomModule({
        classNames: 'modal-dialog',
        children: [
          createDomModule({
            classNames: 'modal-content',
            children: [
              createDomModule({
                classNames: 'modal-header',
                children: [
                  createDomModule({
                    classNames: 'modal-title',
                    innerText: 'Modal Title'
                  })
                ]
              }),
              createDomModule({
                classNames: 'modal-body',
                children: [new Text('body')]
              }),
              createDomModule({
                classNames: 'modal-footer',
                style: { color: 'grey' },
                innerText: 'footer'
              })
            ]
          })
        ]
      })
    )
  }
}
```

The example above builds a modal structure through nested `createDomModule` calls.

As mentioned earlier, `ConvertibleModule` also includes the parameter type of `createDomModule`. So wherever `ConvertibleModule` is accepted, you can omit `createDomModule` — the conversion function will automatically call `createDomModule` internally. And the `children` parameter of `createDomModule` is of type `SubModulesOpt`, which can also be omitted.

Here's the simplified version:

```ts
class Modal extends DivModule {
  constructor() {
    super('modal', 'fade')
    this.addChild({
      classNames: 'modal-dialog',
      children: [
        {
          classNames: 'modal-content',
          children: [
            {
              classNames: 'modal-header',
              children: [
                {
                  classNames: 'modal-title',
                  innerText: 'Modal Title'
                }
              ]
            },
            {
              classNames: 'modal-body',
              children: [new Text('body')]
            },
            {
              classNames: 'modal-footer',
              style: { color: 'grey' },
              innerText: 'footer'
            }
          ]
        }
      ]
    })
  }
}
```
