## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i class-variance-authority lucide-react
```

Copy and paste the following code into your project's `components/ui/code.tsx` file.

## Examples

### Copy Button

### Variants

### Sizes

## API Reference

This component provides a flexible way to display inline code snippets with optional copy functionality.

### Code

| **Prop**                                                                   | **Type**                                       | **Default** |
| -------------------------------------------------------------------------- | ---------------------------------------------- | ----------- |
| `variant` Specifies the code's theme variant.                              | ~enum~ "default" \| "destructive" \| "outline" | `default`   |
| `size` Sets the size of the code component.                                | ~enum~ "sm" \| "default" \| "lg"               | `default`   |
| `showCopyButton` Whether to show a copy button next to the code.           | ~boolean~                                      | `false`     |
| `copyText` Custom text to copy when the copy button is clicked.            | ~string~                                       |             |
| `asChild` Renders the code as a child element, using the `Slot` component. | ~boolean~                                      | `false`     |
| `className` Additional class names for styling the code component.         | ~string~                                       |             |

## Credits

- Built with [class-variance-authority](https://cva.style/docs) for variant management.
- Icons from [Lucide React](https://lucide.dev/guide/packages/lucide-react).
