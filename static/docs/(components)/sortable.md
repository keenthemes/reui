## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities
```

Copy and paste the following code into your project’s `components/ui/sortable.tsx` file.

## Examples

### Grid

### Nested

## API Reference

The Sortable component is a flexible drag-and-drop component for organizing items in lists. Below is the complete API reference:

### Sortable

The root Sortable component includes the following props:

| **Prop**                                                                                                                             | **Type**                               | **Default**  |
| ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------- | ------------ |
| `value` Current sortable list state. The array of items to be sorted.                                                                | ~T[]~                                  |              |
| `onValueChange` Callback when list state changes. Called when items are reordered.                                                   | ~(value: T[]) => void~                 |              |
| `getItemValue` Function to get unique item id. Returns a unique identifier for each item.                                            | ~(item: T) => string~                  |              |
| `children` Sortable list content. The list items.                                                                                    | ~React.ReactNode~                      |              |
| `className` Additional class names. Custom classes for the root element.                                                             | ~string~                               |              |
| `onMove` Custom move handler (overrides default reordering). Called when an item is moved. If provided, disables default reordering. | ~(event: SortableMoveEvent) => void~   |              |
| `strategy` Sorting strategy for the list. Determines how items are arranged.                                                         | ~'horizontal' \| 'vertical' \| 'grid'~ | ~'vertical'~ |
| `onDragStart` Callback when dragging starts. Called when an item begins to be dragged.                                               | ~(event: DragStartEvent) => void~      |              |
| `onDragEnd` Callback when dragging ends. Called when an item is dropped.                                                             | ~(event: DragEndEvent) => void~        |              |

---

### SortableItem

A draggable item in the sortable list.

| **Prop**                                                                     | **Type**    | **Default** |
| ---------------------------------------------------------------------------- | ----------- | ----------- |
| `value` Item id. Unique identifier for the item.                             | ~string~    |             |
| `asChild` Render as child element. Use a custom element as the item.         | ~boolean~   | ~false~     |
| `className` Additional class names. Custom classes for the item.             | ~string~    |             |
| `children` Item content. The item UI.                                        | ~ReactNode~ |             |
| `disabled` Disable drag for this item. Prevents the item from being dragged. | ~boolean~   | ~false~     |

---

### SortableItemHandle

A drag handle for an item.

| **Prop**                                                               | **Type**    | **Default** |
| ---------------------------------------------------------------------- | ----------- | ----------- |
| `asChild` Render as child element. Use a custom element as the handle. | ~boolean~   | ~false~     |
| `className` Additional class names. Custom classes for the handle.     | ~string~    |             |
| `children` Handle content. The handle UI.                              | ~ReactNode~ |             |
| `cursor` Show grab cursor. Show grab/grabbing cursor on the handle.    | ~boolean~   | ~true~      |

---

## Credits

- Built with [DndKit](https://dndkit.com/).
