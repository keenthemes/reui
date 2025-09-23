---
title: Counting Number
description: Counting number with smooth animation.
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

Copy and paste the following code into your project's `components/ui/counting-number.tsx` file.

## Examples

### Decimal

### Format

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### CountingNumber

| **Prop**                                                                                            | **Type**                    | **Default** |
| --------------------------------------------------------------------------------------------------- | --------------------------- | ----------- |
| `from` Starting number for the counting animation.                       | ~number~                    | ~0~         |
| `to` Target number to count to.                                          | ~number~                    | ~100~       |
| `duration` Animation duration in seconds.                                | ~number~                    | ~2~         |
| `delay` Delay before starting animation in milliseconds.                 | ~number~                    | ~0~         |
| `className` CSS class for the number element.                            | ~string~                    |        |
| `startOnView` Whether to start animation when component enters viewport. | ~boolean~                   | ~true~      |
| `once` Whether to animate only once when using startOnView.              | ~boolean~                   | ~false~     |
| `inViewMargin` Margin for in-view detection trigger area.                | ~string~                    |        |
| `onComplete` Callback function when counting animation completes.        | ~() => void~                |        |
| `format` Custom formatting function for the displayed number.            | ~(value: number) => string~ |        |

## Credits

- Inspired by [Motion](https://motion.dev/)
- Built with [Motion](https://motion.dev/).