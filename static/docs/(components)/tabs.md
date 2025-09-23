## Installation

CLI
Manual

### 1.

### 2. Install ReUI

Refer to the [Installation Guide](/docs/installation) for detailed instructions on setting up ReUI dependencies in your project.

### 3. Install dependencies

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/tabs.tsx` file.

## Examples

### Icon

### Badge

### Button

### Pill

### Line

### Vertical

### Size - Large

### Size - Medium

### Size - Small

### Size - Xsmall

### Disabled

## API Reference

This component is built using [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs) primitives. For detailed information, please visit the full API reference.

### Tabs

This component is based on the [Tabs.Root](https://www.radix-ui.com/primitives/docs/components/tabs#root) primitive. For full details, visit the official documentation.

### TabsList

This component is based on the [Tabs.List](https://www.radix-ui.com/primitives/docs/components/tabs#list) primitive and includes the following custom props:

| **Prop**                                                 | **Type**                               | **Default** |
| -------------------------------------------------------- | -------------------------------------- | ----------- |
| `variant` The visual style variant of the tabs list.     | ~enum~ "default" \| "button" \| "line" | ~"default"~ |
| `size` The size of the tabs list.                        | ~enum~ "lg" \| "md" \| "sm" \| "xs"    | ~"md"~      |
| `className` Additional class names for styling the list. | ~string~                               | ~undefined~ |

### TabsTrigger

This component is based on the [Tabs.Trigger](https://www.radix-ui.com/primitives/docs/components/tabs#trigger) primitive and inherits the following props from context:

| **Prop**                                                    | **Type**                               | **Default** |
| ----------------------------------------------------------- | -------------------------------------- | ----------- |
| `variant` Inherited from TabsList context.                  | ~enum~ "default" \| "button" \| "line" | ~"default"~ |
| `size` Inherited from TabsList context.                     | ~enum~ "lg" \| "md" \| "sm" \| "xs"    | ~"md"~      |
| `className` Additional class names for styling the trigger. | ~string~                               | ~undefined~ |

### TabsContent

This component is based on the [Tabs.Content](https://www.radix-ui.com/primitives/docs/components/tabs#content) primitive and includes the following custom props:

| **Prop**                                                    | **Type**         | **Default** |
| ----------------------------------------------------------- | ---------------- | ----------- |
| `variant` The visual style variant of the content.          | ~enum~ "default" | ~"default"~ |
| `className` Additional class names for styling the content. | ~string~         | ~undefined~ |

## Credits

- Built with [Radix UI Tabs](https://www.radix-ui.com/primitives/docs/components/tabs).
