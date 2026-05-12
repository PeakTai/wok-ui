# Modal

The modal component lets you create a dialog with custom content. For ease of use, the component library provides functions to quickly build modals.

## Basic Usage

Use the `showModal` function to quickly build and display a modal module.

```ts
showModal({
  title: 'Title',
  // Custom width; default is 500
  width: 500,
  // The body can be any content convertible to a module
  body: 'Body content'
})
```

## Fullscreen

Set the `fullscreen` parameter to `true` to display the modal in fullscreen mode.

```ts
showModal({
  title: 'Title',
  fullscreen: true,
  body: 'Body content'
})
```

## Static Backdrop

Set the `staticBackDrop` parameter to `true` to make the backdrop purely decorative and prevent closing the modal by clicking it. By default, clicking the backdrop closes the modal.

```ts
showModal({
  title: 'Title',
  staticBackDrop: true,
  body: 'Cannot close by clicking the backdrop'
})
```

With a static backdrop, clicking it makes the modal shake to indicate that the action is not allowed.

## Close Button & Callbacks

Use the `closeBtn` parameter to control whether a close button is displayed. A `title` must be provided — otherwise the entire title bar (including the close button) is hidden. Use the `onClose` option to listen for modal close events.

```ts
showModal({
  title: 'Title',
  closeBtn: false,
  body: 'No close button; can only close by clicking the backdrop',
  onClose: () => showWarning('The modal has been closed')
})
```

## Closing via Handle

The `showModal` function returns an object with a `close` method for programmatically closing the modal.

```ts
const modal = showModal({
  title: 'Title',
  closeBtn: false,
  staticBackDrop: true,
  body: new Button({
    text: 'Click to close modal',
    onClick: () => {
      // Call close when appropriate
      modal.close()
    }
  })
})
```

## Custom Footer Buttons

Use the `buttons` parameter to set footer buttons — a confirm button and a cancel button, both optional.

Here is an example combined with a form:

```ts
const formData = {
  account: '',
  pwd: ''
}
let form = new Form({
  children: [
    new TextInput({
      value: formData.account,
      placeholder: 'Enter account',
      required: true
    }),
    rem(1),
    new PasswordInput({
      value: formData.pwd,
      placeholder: 'Enter password',
      required: true,
      maxLength: 16
    })
  ],
  onSubmit: () =>
    login(formData)
      .then(() => {
        // Close modal after login success
        modal.close()
      })
      .catch(showWarning)
})
const modal = showModal({
  title: 'Login',
  body: form,
  // Show confirm and cancel buttons
  buttons: {
    // confirm and cancel can be boolean or string
    // A string value sets custom button text
    confirm: 'Login',
    cancel: true
  },
  // Handle confirm click
  onConfirm() {
    // When confirm is clicked, trigger form submission
    // Calling form.submit() triggers the onSubmit callback after validation passes
    form.submit()
  }
  // Cancel triggers close; there is no separate cancel event callback.
  // Use onClose if needed.
})
```

## Fully Custom Content

If you don't want the modal's preset styling, you can fully customize it. Set the `replaceByBody` option to `true` to replace the entire modal with the `body` module.

```ts
const modal = showModal({
  // Replace the entire modal
  replaceByBody: true,
  staticBackDrop: true,
  // The body content becomes the entire modal
  body: {
    classNames: 'custom',
    children: [
      'Terms and Conditions',
      rem(1),
      'Please read the following carefully',
      'After reading all the content,',
      'click the button below to close',
      rem(1),
      new Button({
        text: 'I have read and agree to all terms',
        onClick(ev) {
          modal.close()
        }
      })
    ]
  }
})
```
