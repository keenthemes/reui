---
title: Github Button
description: A github button component with animated stars display effects.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/github-button.tsx` file.

## Examples

### Outline

### Separator

### Sizes

## API Reference

This component is built using [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot) and [Motion](https://motion.dev/)
primitives and includes the following custom props:

### GithubButton

| **Prop**                                                                   | **Type**                 | **Default**       |
| -------------------------------------------------------------------------- | ------------------------ | ----------------- |
| `variant` Button visual style variant.                                     | ~'default' \| 'outline'~ | ~'default'~       |
| `size` Button size variant.                                                | ~'md' \| 'sm' \| 'lg'~   | ~'md'~            |
| `className` Optional CSS class name to apply custom styles.                | ~string~                 |                   |
| `roundStars` Whether to round stars number with units (k, M, B, T).        | ~boolean~                | ~false~           |
| `fixedWidth` Whether to maintain fixed width for consistent layout.        | ~boolean~                | ~true~            |
| `initialStars` Initial number of stars to display.                         | ~number~                 | ~0~               |
| `starsClass` CSS class for the stars counter element.                      | ~string~                 |                   |
| `targetStars` Target number of stars to animate to.                        | ~number~                 |                   |
| `separator` Whether to display a separator between the icon and the label. | ~boolean~                | ~false~           |
| `showStarIcon` Whether to display the star icon.                           | ~boolean~                | ~true~            |
| `animationDuration` Animation duration in seconds.                         | ~number~                 | ~2~               |
| `animationDelay` Animation delay in seconds before starting.               | ~number~                 | ~0~               |
| `autoAnimate` Whether to start animation automatically.                    | ~boolean~                | ~true~            |
| `showGithubIcon` Whether to display the GitHub icon.                       | ~boolean~                | ~true~            |
| `filled` Whether stars should start filled.                                | ~boolean~                | ~false~           |
| `repoUrl` Repository URL for actual GitHub integration.                    | ~string~                 |                   |
| `label` Button text label.                                                 | ~string~                 | ~'Star'~          |
| `useInViewTrigger` Use in-view detection to trigger animation.             | ~boolean~                | ~false~           |
| `inViewOptions` Options for in-view detection trigger.                     | ~UseInViewOptions~       | ~\{ once: true }~ |
| `transition` Spring transition options for motion animations.              | ~SpringOptions~          |                   |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).
- Inspired by [Animate UI](https://animate-ui.com/docs/buttons/github-stars).
