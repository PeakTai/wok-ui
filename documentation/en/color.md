# Color

The library also provides unified color management, which together with size management forms a unified standard for built-in modules.

## CSS Variables

| CSS Variable          | Property Name  | Description                        |
| :-------------------- | :------------- | :--------------------------------- |
| --color-primary       | primary        | Primary color, default blue        |
| --color-danger        | danger         | Danger color, default red          |
| --color-success       | success        | Success color, default green       |
| --color-warning       | warning        | Warning color, default orange      |
| --color-border        | border         | Border color, default light gray   |
| --color-text          | text           | Text color, default black          |
| --color-text-secondary| textSecondary  | Secondary text color, default dark gray |
| --color-outline       | outline        | Outline color, default light blue  |

## Updating Color Settings

Use the `setColor` function to change color settings.

```ts
setColor({
  primary: '#1677ff',
  danger: '#ff4d4f',
  success: '#198754',
  warning: '#ffc107',
  border: '#dee2e6',
  text: '#303133',
  textSecondary: '#909399',
  outline: '#b1d2ff'
})
```

Use the `resetColor` function to restore default color settings.

## Getting Current Color Settings

Use the `getColor` function to get color information.

```ts
// Get the primary color
const { primary } = getColor()
```
