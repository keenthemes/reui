---
title: Avatar Group
description: A composable avatar group component with smooth tooltip transitions and glow effects.
component: true
---

## Installation

CLI
Manual

### 1. Install the following dependencies:

```bash
npm i radix-ui motion
```

Copy and paste the following code into your project's `components/ui/avatar-group.tsx` file.

## Examples

### Flip Animation

## API Reference

This component is built using [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar) and [Motion](https://motion.dev/)
primitives and includes the following custom props:

### AvatarGroup

| **Prop**                                                                     | **Type**                               | **Default** |
| ---------------------------------------------------------------------------- | -------------------------------------- | ----------- |
| `children` Child components to be rendered inside the avatar group.          | ~ReactNode~                            |             |
| `className` Optional CSS class name to apply custom styles.                  | ~string~                               |             |
| `tooltipClassName` CSS class for tooltip styling applied to all child items. | ~string~                               |             |
| `animation` Animation type for tooltip transitions.                          | ~enum~ "default" \| "flip" \| "reveal" | ~'default'~ |

### AvatarGroupItem

| **Prop**                                                                   | **Type**    | **Default** |
| -------------------------------------------------------------------------- | ----------- | ----------- |
| `children` Child components including avatar and tooltip content.          | ~ReactNode~ |             |
| `className` Optional CSS class name to apply custom styles.                | ~string~    |             |
| `tooltipClassName` CSS class for tooltip styling, overrides group setting. | ~string~    |             |

### AvatarGroupTooltip

| **Prop**                                                    | **Type**    | **Default** |
| ----------------------------------------------------------- | ----------- | ----------- |
| `children` Content to be displayed in the tooltip.          | ~ReactNode~ |             |
| `className` Optional CSS class name to apply custom styles. | ~string~    |             |

## Credits

- Built with [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).
- Built with [Motion](https://motion.dev/).
- Inspired by [Aceternity UI](https://ui.aceternity.com/components/animated-tooltip).
