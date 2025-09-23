## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm install @base-ui-components/react
```

Copy and paste the following code into your project's `components/ui/base-slider.tsx` file.

## Examples

### Range

A range slider for selecting minimum and maximum values.

### Tooltip

A slider with tooltips showing current values.

### Ticks

A slider integrated with form validation.

### Labels

A slider with labels showing current values.

### Rating

A slider with rating functionality.

### Input

A slider with input fields for precise value control.

### Form

A slider with form validation.

### Vertical

A vertical slider.

## API Reference

This component is based on [Base UI Slider](https://base-ui.com/react/components/slider) primitive and includes the following custom props:

#### Slider

The root component that provides context for all slider parts.

| Prop            | Type                        | Default | Description                         |
| --------------- | --------------------------- | ------- | ----------------------------------- |
| `className`     | `string`                    | -       | Additional CSS classes              |
| `value`         | `number[]`                  | -       | The current slider values           |
| `defaultValue`  | `number[]`                  | -       | The default slider values           |
| `min`           | `number`                    | `0`     | The minimum value                   |
| `max`           | `number`                    | `100`   | The maximum value                   |
| `step`          | `number`                    | `1`     | The step increment                  |
| `onValueChange` | `(value: number[]) => void` | -       | Callback when value changes         |
| `children`      | `ReactNode`                 | -       | The content of the slider component |

#### SliderThumb

The thumb component that can be dragged to change values.

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | -       | Additional CSS classes |

## Credits

- Built with [Base UI Slider](https://base-ui.com/react/components/slider).
