# Message Notifications

The component library includes many built-in message notification components for displaying information and completing interactions with users.

## Loading

Use the `showLoading` function to display a full-screen loading overlay, and the `hideLoading` function to dismiss it.

Example:

```ts
// Show full-screen loading before fetching data
showLoading('Loading...')
fetchData()
  .then(res => {
    // ...
  })
  .catch(err => {
    // Error handling ...
  })
  // Finally hide loading
  .finally(hideLoading)
```

The full-screen loading is a singleton. Calling `showLoading` multiple times still displays the same overlay.

## Toast Messages

The library provides the `showToast` function for displaying toast messages. Two convenience functions, `showWarning` and `showSuccess`, make it even easier to quickly show warning and success messages.

Example:

```ts
fetchData()
  .then(res => {
    // ...
    // Show a success message
    showSuccess('Data fetched successfully!')
  })
  // Display errors via showWarning
  .catch(showWarning)
```

Messages shown via `showWarning` and `showSuccess` automatically disappear after 3 seconds. To customize the duration, use `showToast`.

```ts
showToast({
  type: 'warning',
  text: 'This message will stay for 5 seconds',
  duration: 5000
})
```

## Dialogs

Dialogs are a type of strongly interactive message — the user must complete an interaction before the dialog can be closed.

The `showAlert` function displays a dialog that the user must confirm by clicking:

```ts
showAlert('Cannot submit a duplicate order').then(() => {
  // Operation after user confirms ...
})
```

The `showConfirm` function displays a dialog that lets the user choose between confirm and cancel:

```ts
showConfirm('This operation carries risk. Continue?').then(res => {
  if (res) {
    // User chose confirm ...
  } else {
    // User chose cancel ...
  }
})
```
