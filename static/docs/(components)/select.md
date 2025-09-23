## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/select.tsx` file.

## Examples

### Group

### Disabled

### Disabled Option

### Size

### Indicator Position

### Custom Indicator

### Icon

### Status

### Badge

### Avatar

### Form

## API Reference

This component is built using [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select) primitives. For detailed information, please visit the full API reference.

### Select

This component is based on the [Select.Root](https://www.radix-ui.com/primitives/docs/components/select#root) primitive and includes the following custom props:

| **Prop**                                                                  | **Type**                 | **Default** |
| ------------------------------------------------------------------------- | ------------------------ | ----------- |
| `indicatorPosition` Position of the selection indicator.                  | ~enum~ "left" \| "right" | ~"left"~    |
| `indicatorVisibility` Controls the visibility of the selection indicator. | ~boolean~                | ~true~      |
| `indicator` Custom indicator element to replace the default check icon.   | ~ReactNode~              |             |

### SelectTrigger

This component is based on the [Select.Trigger](https://www.radix-ui.com/primitives/docs/components/select#trigger) primitive and includes the following custom props:

| **Prop**                                                    | **Type**                    | **Default** |
| ----------------------------------------------------------- | --------------------------- | ----------- |
| `size` Controls the size of the select trigger.             | ~enum~ "xs" \| "sm" \| "md" | ~"md"~      |
| `className` Additional class names for styling the trigger. | ~string~                    |             |

### SelectContent

This component is based on the [Select.Content](https://www.radix-ui.com/primitives/docs/components/select#content) primitive and includes the following custom props:

| **Prop**                                    | **Type**   | **Default** |
| ------------------------------------------- | ---------- | ----------- |
| `position` The positioning strategy to use. | ~"popper"~ | ~"popper"~  |

## Credits

- Built with [Radix UI Select](https://www.radix-ui.com/primitives/docs/components/select).
