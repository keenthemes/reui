---
title: Typing Text
description: A typing text animation component with realistic typing effects and customizable cursor.
component: true
---

## Installation

CLI
Manual

### 1. Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/typing-text.tsx` file.

## Examples

### Loop

### Fast

### Slow

### No Cursor

## API Reference

### TypingText

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

| **Prop**                                                                 | **Type**                                                                                                                                         | **Default** |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `text` Single text to animate when not using texts array.                | ~string~                                                                                                                                         |             |
| `texts` Array of texts to cycle through for multiple typing sequences.   | ~string[]~                                                                                                                                       |             |
| `speed` Typing speed in milliseconds between each character.             | ~number~                                                                                                                                         | ~100~       |
| `delay` Delay before starting animation in milliseconds.                 | ~number~                                                                                                                                         | ~0~         |
| `showCursor` Whether to display the blinking cursor.                     | ~boolean~                                                                                                                                        | ~true~      |
| `cursor` Character to use for the cursor.                                | ~string~                                                                                                                                         | ~"\|"~      |
| `cursorClassName` CSS class for styling the cursor element.              | ~string~                                                                                                                                         |             |
| `loop` Whether to loop through texts array continuously.                 | ~boolean~                                                                                                                                        | ~false~     |
| `pauseDuration` Pause duration between loops in milliseconds.            | ~number~                                                                                                                                         | ~2000~      |
| `className` CSS class for the container element.                         | ~string~                                                                                                                                         |             |
| `onComplete` Callback function when typing animation completes.          | ~() => void~                                                                                                                                     |             |
| `startOnView` Whether to start animation when component enters viewport. | ~boolean~                                                                                                                                        | ~true~      |
| `once` Whether to animate only once when using startOnView.              | ~boolean~                                                                                                                                        | ~false~     |
| `animation` Animation preset variant for the text container.             | ~enum~ "fadeIn" \| "blurIn" \| "blurInUp" \| "blurInDown" \| "slideUp" \| "slideDown" \| "slideLeft" \| "slideRight" \| "scaleUp" \| "scaleDown" |             |
| `inViewMargin` Margin for in-view detection trigger area.                | ~string~                                                                                                                                         |             |

## Credits

- Built with [Motion](https://motion.dev/).
