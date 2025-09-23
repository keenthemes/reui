## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm install @base-ui-components/react
```

Copy and paste the following code into your project's `components/ui/base-radio-group.tsx` file.

## Examples

### Checked

### Disabled

### Size

### Form

## API Reference

This component is based on the [Base UI Radio Group](https://base-ui.com/react/components/radio-group) primitive.

### RadioGroup

A customized radio group component that extends the Base UI RadioGroup primitive with additional styling and features. It supports all the props from Base UI's RadioGroup component.

| **Prop**    | **Type**                    | **Default** | **Description**                                               |
| ----------- | --------------------------- | ----------- | ------------------------------------------------------------- |
| `className` | ~string~                    |             | Additional class names for styling the radio group container. |
| `size`      | ~enum~ "sm" \| "md" \| "lg" | "md"        | The size of the radio group items.                            |

### RadioGroupItem

A customized radio group item component that extends the Base UI Radio primitive with additional styling and features. It supports all the props from Base UI's Radio.Root component.

| **Prop**    | **Type**                    | **Default** | **Description**                                                              |
| ----------- | --------------------------- | ----------- | ---------------------------------------------------------------------------- |
| `className` | ~string~                    |             | Additional class names for styling the radio group item.                     |
| `size`      | ~enum~ "sm" \| "md" \| "lg" |             | The size of the radio group item. Inherits from RadioGroup if not specified. |
| `value`     | ~string~                    |             | The value of the radio group item.                                           |
| `disabled`  | ~boolean~                   | false       | Whether the radio group item is disabled.                                    |

## Credits

- Built with [Base UI Radio Group](https://base-ui.com/react/components/radio-group).
