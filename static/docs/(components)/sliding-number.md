## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/sliding-number.tsx` file.

## Examples

### Slider

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### SlidingNumber

| Prop                                                                   | Type       | Default |
| ---------------------------------------------------------------------- | ---------- | ------- |
| `from` The starting number value for the animation                     | ~number~   |         |
| `to` The target number value for the animation                         | ~number~   |         |
| `duration` Animation duration in seconds                               | ~number~   | ~2~     |
| `delay` Delay before animation starts in seconds                       | ~number~   | ~0~     |
| `startOnView` Whether to start animation when element comes into view  | ~boolean~  | ~true~  |
| `once` Whether to animate only once when in view                       | ~boolean~  | ~false~ |
| `className` Additional CSS classes to apply to the component           | ~string~   |         |
| `onComplete` Callback function called when animation completes         | ~function~ |         |
| `digitHeight` Height of each digit in pixels for the sliding animation | ~number~   | ~40~    |

## Credits

- Inspired by [Motion Primitives](https://motion-primitives.com/docs/sliding-number)
- Built with [Motion](https://motion.dev/).
