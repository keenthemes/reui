## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm install @base-ui-components/react
```

Copy and paste the following code into your project's `components/ui/base-progress.tsx` file.

## Examples

### Status

A progress bar with status messages and detailed feedback.

### Sizes

Different sizes of progress bars.

### Colors

Different color variants for different states.

### Animated

Animated progress bars with smooth transitions and effects.

## API Reference

This component is based on [Base UI Progress](https://base-ui.com/react/components/progress) primitive and includes the following custom props:

#### Progress

The root component that provides context for all progress parts.

| Prop        | Type        | Default | Description                           |
| ----------- | ----------- | ------- | ------------------------------------- |
| `className` | `string`    | -       | Additional CSS classes                |
| `value`     | `number`    | -       | The current progress value (0-100)    |
| `max`       | `number`    | `100`   | The maximum progress value            |
| `children`  | `ReactNode` | -       | The content of the progress component |

#### ProgressValue

The value display component for showing progress percentage.

| Prop        | Type     | Default | Description            |
| ----------- | -------- | ------- | ---------------------- |
| `className` | `string` | -       | Additional CSS classes |

## Credits

- Built with [Base UI Progress](https://base-ui.com/react/components/progress).
