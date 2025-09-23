---
title: Button
description: Renders a clickable button or an element styled as a button
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm install @base-ui-components/react
```

Copy and paste the following code into your project’s `components/ui/button.tsx` file.

## Examples

### Secondary

### Mono

### Destructive

### Outline

### Dashed

### Ghost

### With Icon

### As Input

### Icon Only

### Loading

### Badge

### Size

### Circle

### Link

### Full Width

### Disabled

## API Reference

This component provides a versatile and customizable button system with various styles, appearances, and sizes.

### Button

This is the root component for creating buttons with multiple variants, appearances, sizes, and shapes.

| **Prop**                                                                                               | **Type**                                                                                                                                                          | **Default** |
| ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `variant` Specifies the button's theme.                                     | ~enum~  "primary" \| "mono" \| "destructive" \| "secondary" \| "outline" \| "dashed" \| "ghost" \| "dim" \| "foreground" \| "inverse"  | ~primary~   |
| `appearance` Defines the visual style of the button.                        | ~enum~  "ghost"                                                                                                                        |        |
| `size` Determines the size of the button.                                   | ~enum~  "md" \| "sm" \| "xs" \| "xxs"                                                                                                  | ~md~        |
| `shape` Specifies the shape of the button.                                  | ~enum~  "default" \| "circle"                                                                                                          | ~default~   |
| `mode` Defines the button's interaction style.                              | ~enum~  "default" \| "icon" \| "link"                                                                                                  | ~default~   |
| `underline` Sets the underline style for link mode.                         | ~enum~  "solid" \| "dashed"                                                                                                            |        |
| `underlined` Defines a persistent underline for link mode.                  | ~enum~  "solid" \| "dashed"                                                                                                            |        |
| `asChild` Renders the button as a child element using the `Slot` component. | ~boolean~                                                                                                                                                         | ~false~     |
| `className` Additional class names for styling the button.                  | ~string~                                                                                                                                                          |        |

## Credits

- Built with [Base UI useRender](https://base-ui.com/react/utils/use-render) hook.