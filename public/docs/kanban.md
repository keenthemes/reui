---
title: Kanban
description: A drag-and-drop kanban component designed for seamless item organization across customizable columns.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities
```

Copy and paste the following code into your project’s `components/ui/kanban.tsx` file.

## Examples

### Overlay

## API Reference

The Kanban component is a flexible drag-and-drop board for organizing items in columns. Below is the complete API reference:

### Kanban

The root Kanban component includes the following props:

| **Prop**                                                                                                                             | **Type**                              | **Default** |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------- |
| `value` Current kanban board state. The columns and their items.                                                                     | ~Record\~                             |             |
| `onValueChange` Callback when board state changes. Called when columns/items are reordered or moved.                                 | ~(value: Record\string T[]>) => void~ |             |
| `getItemValue` Function to get unique item id. Returns a unique identifier for each item.                                            | ~(item: T) => string~                 |             |
| `children` Kanban board content. The board layout and columns.                                                                       | ~React.ReactNode~                     |             |
| `className` Additional class names. Custom classes for the root element.                                                             | ~string~                              |             |
| `onMove` Custom move handler (overrides default reordering). Called when an item is moved. If provided, disables default reordering. | ~(event: KanbanMoveEvent) => void~    |             |

---

### KanbanColumn

A draggable column in the Kanban board.

| **Prop**                                                                         | **Type**    | **Default** |
| -------------------------------------------------------------------------------- | ----------- | ----------- |
| `value` Column id. Unique identifier for the column.                             | ~string~    |             |
| `className` Additional class names. Custom classes for the column.               | ~string~    |             |
| `children` Column content. The column header and items.                          | ~ReactNode~ |             |
| `disabled` Disable drag for this column. Prevents the column from being dragged. | ~boolean~   | ~false~     |

---

### KanbanColumnHandle

A drag handle for a column.

| **Prop**                                                               | **Type**    | **Default** |
| ---------------------------------------------------------------------- | ----------- | ----------- |
| `asChild` Render as child element. Use a custom element as the handle. | ~boolean~   | ~false~     |
| `className` Additional class names. Custom classes for the handle.     | ~string~    |             |
| `children` Handle content. The handle UI.                              | ~ReactNode~ |             |
| `cursor` Show grab cursor. Show grab/grabbing cursor on the handle.    | ~boolean~   | ~true~      |

---

### KanbanItem

A draggable item in a column.

| **Prop**                                                                     | **Type**    | **Default** |
| ---------------------------------------------------------------------------- | ----------- | ----------- |
| `value` Item id. Unique identifier for the item.                             | ~string~    |             |
| `asChild` Render as child element. Use a custom element as the item.         | ~boolean~   | ~false~     |
| `className` Additional class names. Custom classes for the item.             | ~string~    |             |
| `children` Item content. The item UI.                                        | ~ReactNode~ |             |
| `disabled` Disable drag for this item. Prevents the item from being dragged. | ~boolean~   | ~false~     |

---

### KanbanItemHandle

A drag handle for an item.

| **Prop**                                                               | **Type**    | **Default** |
| ---------------------------------------------------------------------- | ----------- | ----------- |
| `asChild` Render as child element. Use a custom element as the handle. | ~boolean~   | ~false~     |
| `className` Additional class names. Custom classes for the handle.     | ~string~    |             |
| `children` Handle content. The handle UI.                              | ~ReactNode~ |             |
| `cursor` Show grab cursor. Show grab/grabbing cursor on the handle.    | ~boolean~   | ~true~      |

---

### KanbanColumnContent

A wrapper for the items in a column.

| **Prop**                                                                    | **Type**    | **Default** |
| --------------------------------------------------------------------------- | ----------- | ----------- |
| `value` Column id. The column this content belongs to.                      | ~string~    |             |
| `className` Additional class names. Custom classes for the content wrapper. | ~string~    |             |
| `children` Items content. The items in the column.                          | ~ReactNode~ |             |

---

### KanbanOverlay

A custom overlay for the dragged item or column.

| **Prop**                                                                                                  | **Type**                                                                                        | **Default** |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------- |
| `className` Additional class names. Custom classes for the overlay.                                       | ~string~                                                                                        |             |
| `children` Overlay content or render function. The overlay UI or a function that returns overlay content. | ~ReactNode \| (params: \{ value: UniqueIdentifier; variant: 'column' \| 'item' }) => ReactNode~ |             |

---

## Credits

- Built with [DndKit](https://dndkit.com/).
