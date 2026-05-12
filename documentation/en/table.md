# Table

A table is a commonly used data display component on web pages. The component library provides a simple `Table` module to meet basic needs.

## Basic Usage

A table needs to be bound to an array, and then you process the elements of the data.

Data preparation — the example uses demo data. In real development, data typically comes from a server.

```ts
interface User {
  id: string
  name: string
  age: number
  city: string
  gender: string
  dept: string
  status: string
}

const list: User[] = [
  {
    id: '001',
    name: 'John Doe',
    age: 25,
    city: 'New York',
    gender: 'Male',
    dept: 'R&D',
    status: 'Active'
  }
  // More elements omitted...
]
```

Now use `list` to build a table.

```ts
/**
 * Declare a checked IDs array to store the IDs of checked users
 */
let checkedIds: string[] = []

// Table is generic; the type must be specified
// Otherwise type inference may not work in column definitions
new Table<User>({
  // Bordered style
  bordered: true,
  // The data list — User[] type, matches the generic
  list,
  cols: [
    // A column showing row numbers
    new TableIndexColumn(),
    // A checkbox column
    new TableCheckboxColumn({
      // Checkbox value is the user ID
      value: user => user.id,
      // Initial checked state
      checked: user => checkedIds.includes(user.id),
      // Callback to save the checked IDs
      onChange(checkedVals) {
        checkedIds = checkedVals
      }
    }),
    // A plain column — header is "Name", content is the user's name
    new TableColumn({ name: 'Name', width: 100, content: user => user.name }),
    // Content can be any module
    new TableColumn({
      name: 'Status',
      content: user => {
        if (user.status === 'Active') {
          return new PrimaryBodyText('Active').setColor(getColor().success)
        } else {
          return new PrimaryBodyText('Frozen').setColor(getColor().danger)
        }
      }
    })
  ]
})
```

Currently, the table component only supports simple data display. It does not support fixed headers/columns or cell merging.
