---
title: Grid Background
description: A responsive grid background with animated moving beams.
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

Copy and paste the following code into your project's `components/ui/grid-background.tsx` file.

## Examples

### Hero

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### GridBackground

| **Prop**                                                                                    | **Type**                                                                                                                            | **Default**                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children` Content to display over the grid background.          | ~ReactNode~                                                                                                                         |                                                                                                                                                                                                |
| `gridSize` Grid dimensions in format 'cols:rows'.                | ~enum~  "4:4" \| "5:5" \| "6:6" \| "6:8" \| "8:8" \| "8:12" \| "10:10" \| "12:12" \| "12:16" \| "16:16"  | ~"8:8"~                                                                                                                                                                                             |
| `className` CSS class for the background container.              | ~string~                                                                                                                            |                                                                                                                                                                                                |
| `colors.background` Background color CSS class.                  | ~string~                                                                                                                            | ~"bg-slate-900"~                                                                                                                                                                                    |
| `colors.borderColor` Grid border color CSS class.                | ~string~                                                                                                                            | ~"border-slate-700/50"~                                                                                                                                                                             |
| `colors.borderSize` Grid border width in CSS units.              | ~string~                                                                                                                            | ~"1px"~                                                                                                                                                                                             |
| `colors.borderStyle` Grid border style.                          | ~enum~  "solid" \| "dashed" \| "dotted"                                                                  | ~"solid"~                                                                                                                                                                                           |
| `beams.count` Number of animated beams to display.               | ~number~                                                                                                                            | ~12~                                                                                                                                                                                                |
| `beams.colors` Array of CSS classes for beam colors.             | ~string[]~                                                                                                                          | ~["bg-cyan-400", "bg-purple-400", "bg-fuchsia-400", "bg-violet-400", "bg-blue-400", "bg-indigo-400", "bg-green-400", "bg-yellow-400", "bg-orange-400", "bg-red-400", "bg-pink-400", "bg-rose-400"]~ |
| `beams.shadow` Shadow and styling CSS classes for beams.         | ~string~                                                                                                                            | ~"shadow-lg shadow-cyan-400/50 rounded-full"~                                                                                                                                                       |
| `beams.speed` Base animation speed in seconds for beam movement. | ~number~                                                                                                                            | ~4~                                                                                                                                                                                                 |

## Credits

- Built with [Motion](https://motion.dev/).