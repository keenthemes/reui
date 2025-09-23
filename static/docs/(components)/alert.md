## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/alert.tsx` file.

## Examples

### Solid

### Mono

### Outline

### Light

### Size

### Extended

### Actions

## API Reference

The Alert component is a custom implementation that provides flexible and customizable alert messages. Here's the complete API reference:

### Alert

The root Alert component includes the following props:

| **Prop**                                                      | **Type**                                                                                     | **Default** |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------- |
| `variant` Specifies the alert's theme.                        | ~enum~ "default" \| "primary" \| "destructive" \| "success" \| "info" \| "mono" \| "warning" | ~default~   |
| `appearance` Determines the appearance of the alert.          | ~enum~ "solid" \| "outline" \| "light" \| "stroke"                                           | ~solid~     |
| `size` Determines the size of the alert.                      | ~enum~ "xs" \| "sm" \| "md"                                                                  | ~md~        |
| `className` Additional class names for styling the alert.     | ~string~                                                                                     |             |
| `close` Controls whether the alert can be closed by the user. | ~boolean~                                                                                    | ~true~      |
| `onClose` Callback function when the alert is closed.         | ~function~                                                                                   |             |

### AlertTitle

The AlertTitle component includes the following props:

| **Prop**                                                  | **Type**  | **Default** |
| --------------------------------------------------------- | --------- | ----------- |
| `asChild` Renders the title as a child element.           | ~boolean~ | ~false~     |
| `className` Additional class names for styling the title. | ~string~  |             |

### AlertDescription

The AlertDescription component includes the following props:

| **Prop**                                                        | **Type**  | **Default** |
| --------------------------------------------------------------- | --------- | ----------- |
| `asChild` Renders the description as a child element.           | ~boolean~ | ~false~     |
| `className` Additional class names for styling the description. | ~string~  |             |

### AlertIcon

The AlertIcon component includes the following props:

| **Prop**                                                       | **Type**                                                              | **Default** |
| -------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| `variant` Specifies the alert icon's theme.                    | ~enum~ "primary" \| "destructive" \| "success" \| "info" \| "warning" |             |
| `className` Additional class names for styling the alert icon. | ~string~                                                              |             |

### AlertContent

The AlertContent component includes the following props:

| **Prop**                                                          | **Type** | **Default** |
| ----------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the alert content. | ~string~ |             |

### AlertToolbar

The AlertToolbar component includes the following props:

| **Prop**                                                          | **Type**                                                              | **Default** |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| `variant` Specifies the alert toolbar's theme.                    | ~enum~ "primary" \| "destructive" \| "success" \| "info" \| "warning" |             |
| `className` Additional class names for styling the alert toolbar. | ~string~                                                              |             |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).
