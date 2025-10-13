---
title: Switch
description: A control that allows the user to toggle between checked and unchecked states.
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/switch.tsx` file.

## Examples

### Disabled

### Square

### Size

### Indicator

### Icon

### Button

### Advanced Label

### Form

## API Reference

This component is built using [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch) primitives. For detailed information, please visit the full API reference.

### Switch

This component is based on the [Switch.Root](https://www.radix-ui.com/primitives/docs/components/switch#root) primitive and includes the following custom props:

| **Prop**                                                                                  | **Type**                                                                 | **Default** |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ----------- |
| `shape` The shape of the switch.                               | ~enum~  "pill" \| "square"                    | ~"pill"~    |
| `size` The size of the switch.                                 | ~enum~  "xs" \| "sm" \| "md" \| "lg" \| "xl"  | ~"md"~      |
| `thumbClassName` Additional class names for styling the thumb. | ~string~                                                                 | ~undefined~ |

### SwitchWrapper

This is a custom component that provides context for permanent state and layout.

| **Prop**                                                                                                 | **Type**  | **Default** |
| -------------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `permanent` Whether the switch should maintain its appearance in both states. | ~boolean~ | ~false~     |
| `className` Additional class names for styling the wrapper.                   | ~string~  | ~undefined~ |

### SwitchIndicator

This is a custom component that provides visual indicators for the switch states.

| **Prop**                                                                                 | **Type**                                          | **Default** |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------- |
| `state` The state of the indicator.                           | ~enum~  "on" \| "off"  | ~"off"~     |
| `className` Additional class names for styling the indicator. | ~string~                                          | ~undefined~ |

## Credits

- Built with [Radix UI Switch](https://www.radix-ui.com/primitives/docs/components/switch).