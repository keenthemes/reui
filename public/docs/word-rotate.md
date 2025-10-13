---
title: Word Rotate
description: A word rotate animation component with realistic typing effects and customizable cursor.
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

Copy and paste the following code into your project's `components/ui/word-rotate.tsx` file.

## Examples

### Slide

### Flip

### Scale

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### WordRotate

| **Prop**                                                                                            | **Type**                                                                                      | **Default** |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ----------- |
| `words` Array of words to rotate through in sequence.                    | ~string[]~                                                                                    |        |
| `duration` Duration each word is visible in milliseconds.                | ~number~                                                                                      | ~1500~      |
| `animationStyle` Animation style for word transitions.                   | ~enum~  "fade" \| "slide-up" \| "slide-down" \| "scale" \| "flip"  | ~"fade"~    |
| `loop` Whether to loop through words continuously.                       | ~boolean~                                                                                     | ~true~      |
| `pauseDuration` Pause duration between word transitions in milliseconds. | ~number~                                                                                      | ~300~       |
| `className` CSS class for the word element.                              | ~string~                                                                                      |        |
| `containerClassName` CSS class for the container element.                | ~string~                                                                                      |        |
| `startOnView` Whether to start animation when component enters viewport. | ~boolean~                                                                                     | ~true~      |
| `once` Whether to animate only once when using startOnView.              | ~boolean~                                                                                     | ~false~     |
| `inViewMargin` Margin for in-view detection trigger area.                | ~string~                                                                                      |        |

## Credits

- Built with [Motion](https://motion.dev/).