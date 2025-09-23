## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/badge.tsx` file.

## Examples

### Light

### Outline

### Circle

### With Dot

### With Icon

### Remove Button

### Square

### Size

### asChild

### Disabled

## API Reference

This component provides a customizable badge system with flexible variants, sizes, and appearances.

### Badge

| **Prop**                                                                    | **Type**                                                                                         | **Default** |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------- |
| `variant` Specifies the badge's theme.                                      | ~enum~ "primary" \| "secondary" \| "outline" \|"success" \| "warning" \| "info" \| "destructive" | `secondary` |
| `appearance` Determines the badge's visual appearance.                      | ~enum~ "default" \| "outline" \| "light" \| "ghost"                                              | `default`   |
| `size` Sets the size of the badge.                                          | ~enum~ "lg" \| "md" \| "sm" \| "xs"                                                              | `md`        |
| `shape` Determines the shape of the badge.                                  | ~enum~ "default" \| "circle"                                                                     | `default`   |
| `disabled` Specifies whether the badge is disabled.                         | ~boolean~                                                                                        | `false`     |
| `asChild` Renders the badge as a child element, using the `Slot` component. | ~boolean~                                                                                        | `false`     |
| `className` Additional class names for styling the badge.                   | ~string~                                                                                         |             |

### BadgeButton

| **Prop**                                                                     | **Type**         | **Default** |
| ---------------------------------------------------------------------------- | ---------------- | ----------- |
| `variant` Specifies the badge button's theme.                                | ~enum~ "default" | `default`   |
| `asChild` Renders the button as a child element, using the `Slot` component. | ~boolean~        | `false`     |
| `className` Additional class names for styling the badge button.             | ~string~         |             |

### BadgeDot

| **Prop**                                                      | **Type** | **Default** |
| ------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the badge dot. | ~string~ |             |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).
