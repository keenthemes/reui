---
title: Hover Background
description: An interactive background component with animated objects that respond to hover interactions and customizable colors.
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/hover-background.tsx` file.

## Examples

### Dark

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### HoverBackground

| **Prop**                                                                                  | **Type**                                                                                        | **Default**                                                                                                             |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `objectCount` Number of animated objects to display (1-12).    | ~enum~  1 \| 2 \| 3 \| 4 \| 5 \| 6 \| 7 \| 8 \| 9 \| 10 \| 11 \| 12  | ~12~                                                                                                                    |
| `children` Content to display over the interactive background. | ~ReactNode~                                                                                     |                                                                                                                    |
| `className` CSS class for the background container.            | ~string~                                                                                        |                                                                                                                    |
| `colors.background` Background gradient CSS class.             | ~string~                                                                                        | ~"bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"~                                                        |
| `colors.objects` Array of CSS classes for object colors.       | ~string[]~                                                                                      | ~["bg-cyan-400/20", "bg-purple-400/20", "bg-fuchsia-400/20", "bg-violet-400/20", "bg-blue-400/20", "bg-indigo-400/20"]~ |
| `colors.glow` Glow effect color for hover interactions.        | ~string~                                                                                        | ~"shadow-cyan-400/50"~                                                                                                  |

## Credits

- Built with [Motion](https://motion.dev/).