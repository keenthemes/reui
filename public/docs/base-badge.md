---
title: Base Badge
description: A customizable badge component built with Base UI and useRender hook for composition.
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

Copy and paste the following code into your project's `components/ui/base-badge.tsx` file.

## Examples

### Outline

### Light

### Ghost

### Disabled

### Size

### Circle

### Square

### With Icon

### With Dot

### Remove Button

### Render Prop

## API Reference

This component supports both Base UI's `useRender` hook pattern and traditional `asChild` prop for backward compatibility.

### Badge

| **Prop**                                                                                                       | **Type**                                                                                          | **Default** |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| `render` Element or component to render the badge as.                                                          | ~React.ReactElement~                                                                              | ``          |
| `asChild` Change the default rendered element for the one passed as a child, merging their props and behavior. | ~boolean~                                                                                         | `false`     |
| `variant` The visual style variant of the badge.                                                               | ~enum~ "primary" \| "secondary" \| "success" \| "warning" \| "info" \| "outline" \| "destructive" | `primary`   |
| `appearance` The appearance style of the badge.                                                                | ~enum~ "default" \| "light" \| "outline" \| "ghost"                                               | `default`   |
| `size` The size of the badge.                                                                                  | ~enum~ "xs" \| "sm" \| "md" \| "lg"                                                               | `md`        |
| `shape` The shape of the badge.                                                                                | ~enum~ "default" \| "circle"                                                                      | `default`   |
| `disabled` Whether the badge is disabled.                                                                      | ~boolean~                                                                                         | `false`     |

### BadgeButton

| **Prop**                                                                                                       | **Type**             | **Default** |
| -------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `render` Element or component to render the badge button as.                                                   | ~React.ReactElement~ | ``          |
| `asChild` Change the default rendered element for the one passed as a child, merging their props and behavior. | ~boolean~            | `false`     |

### BadgeDot

This is a simple span element with no additional props beyond standard HTML attributes.
