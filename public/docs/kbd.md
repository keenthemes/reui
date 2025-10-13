---
title: Kbd
description: Displays keyboard input or shortcut keys with customizable styles and sizes.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i @reui/ui
```

Copy and paste the following code into your project’s `components/ui/kbd.tsx` file.

## Examples

### Outline

### Size

## API Reference

This component provides a customizable keyboard input display with various styles and sizes.

### Kbd

This component is a custom implementation that displays keyboard inputs with the following props:

| **Prop**                                                  | **Type**                                 | **Default** |
| --------------------------------------------------------- | ---------------------------------------- | ----------- |
| `variant` The visual style variant of the keyboard input. | ~enum~ "default" \| "solid" \| "outline" | ~"default"~ |
| `size` The size of the keyboard input display.            | ~enum~ "md" \| "sm" \| "xs"              | ~"md"~      |
| `className` Additional class names for styling.           | ~string~                                 |             |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).
