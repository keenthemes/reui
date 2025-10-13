---
title: Shimmering Text
description: A text component with beautiful shimmer animation effects that glide across the text.
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

Copy and paste the following code into your project's `components/ui/shimmering-text.tsx` file.

## Examples

### Color

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### ShimmeringText

| Prop                                                                         | Type      | Default |
| ---------------------------------------------------------------------------- | --------- | ------- |
| `text` Text to display with shimmer effect                                   | ~string~  | -       |
| `duration` Animation duration in seconds                                     | ~number~  | ~2~     |
| `delay` Delay before starting animation                                      | ~number~  | ~0~     |
| `repeat` Whether to repeat the animation                                     | ~boolean~ | ~true~  |
| `repeatDelay` Pause duration between repeats in seconds                      | ~number~  | ~0.5~   |
| `className` Custom CSS classes to apply to the component                     | ~string~  | -       |
| `startOnView` Whether to start animation when component enters viewport      | ~boolean~ | ~true~  |
| `once` Whether to animate only once                                          | ~boolean~ | ~false~ |
| `inViewMargin` Margin for in-view detection (rootMargin)                     | ~string~  | -       |
| `spread` Shimmer spread multiplier - affects the width of the shimmer effect | ~number~  | ~2~     |
| `color` Base text color (overrides default theme colors)                     | ~string~  | -       |
| `shimmerColor` Shimmer gradient color (overrides default theme colors)       | ~string~  | -       |

## Credits

- Built with [Motion](https://motion.dev/).
