## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/pagination.tsx` file.

## Examples

### Icon

### Card

## API Reference

This component provides a customizable pagination system with support for various layouts and styles.

### Pagination

This component is the root container for pagination elements.

| **Prop**                                                                 | **Type** | **Default** |
| ------------------------------------------------------------------------ | -------- | ----------- |
| `className` Additional class names for styling the navigation container. | ~string~ |             |

### PaginationContent

This component provides the container for pagination items.

| **Prop**                                                              | **Type** | **Default** |
| --------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the content container. | ~string~ |             |

### PaginationItem

This component represents an individual item in the pagination.

| **Prop**                                                            | **Type** | **Default** |
| ------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the pagination item. | ~string~ |             |

### PaginationLink

This component represents a clickable pagination link.

| **Prop**                                                    | **Type**              | **Default** |
| ----------------------------------------------------------- | --------------------- | ----------- |
| `isActive` Whether the pagination item is currently active. | ~boolean~             | ~false~     |
| `size` The size of the pagination link.                     | ~ButtonProps["size"]~ |             |
| `className` Additional class names for styling the link.    | ~string~              |             |

### PaginationEllipsis

This component displays an ellipsis to indicate additional pages.

| **Prop**                                                     | **Type** | **Default** |
| ------------------------------------------------------------ | -------- | ----------- |
| `className` Additional class names for styling the ellipsis. | ~string~ |             |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).
