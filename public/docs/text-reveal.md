---
title: Text Reveal
description: Animate text with various reveal effects including fade, slide, scale, blur, typewriter, wave, stagger, rotate, and elastic animations.
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

Copy and paste the following code into your project's `components/ui/text-reveal.tsx` file.

## Examples

### Slide Variants

### Scale

### Blur

### Typewriter

### Wave

### Stagger

### Rotate

### Elastic

### Neon Glow

### Fire Magic

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### TextReveal

| **Prop**                                                                                            | **Type**                                                                                                                                                                                   | **Default** |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `children` Text content to be revealed with animation.                   | ~string~                                                                                                                                                                                   |        |
| `variant` Animation style for text reveal effect.                        | ~enum~  "fade" \| "slideUp" \| "slideDown" \| "slideLeft" \| "slideRight" \| "scale" \| "blur" \| "typewriter" \| "wave" \| "stagger" \| "rotate" \| "elastic"  | ~"fade"~    |
| `className` CSS class for the container element.                         | ~string~                                                                                                                                                                                   |        |
| `style` Inline styles for the container element.                         | ~React.CSSProperties~                                                                                                                                                                      |        |
| `delay` Delay before starting animation in seconds.                      | ~number~                                                                                                                                                                                   | ~0~         |
| `duration` Animation duration in seconds.                                | ~number~                                                                                                                                                                                   | ~0.6~       |
| `staggerDelay` Delay between individual character animations in seconds. | ~number~                                                                                                                                                                                   | ~0.03~      |
| `once` Whether to animate only once when using startOnView.              | ~boolean~                                                                                                                                                                                  | ~true~      |
| `startOnView` Whether to start animation when component enters viewport. | ~boolean~                                                                                                                                                                                  | ~true~      |
| `wordLevel` Whether to animate at word level instead of character level. | ~boolean~                                                                                                                                                                                  | ~false~     |
| `onComplete` Callback function when reveal animation completes.          | ~() => void~                                                                                                                                                                               |        |

## Credits

- Built with [Motion](https://motion.dev/).