## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/sheet.tsx` file.

## Examples

### Scrollable

### Side

## API Reference

This component is built using [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) primitives. For detailed information, please visit the full API reference.

### SheetContent

This component is based on the [Dialog.Content](https://www.radix-ui.com/primitives/docs/components/dialog#content) primitive and includes the following custom props:

| **Prop**                                                    | **Type**                                      | **Default** |
| ----------------------------------------------------------- | --------------------------------------------- | ----------- |
| `side` The side from which the sheet appears.               | ~enum~ "top" \| "bottom" \| "left" \| "right" | ~"right"~   |
| `overlay` Whether to show the overlay background.           | ~boolean~                                     | ~true~      |
| `close` Whether to show the close button.                   | ~boolean~                                     | ~true~      |
| `className` Additional class names for styling the content. | ~string~                                      |             |

## Credits

- Built with [Radix UI Sheet](https://www.radix-ui.com/primitives/docs/components/dialog).
