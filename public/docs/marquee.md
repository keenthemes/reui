---
title: Marquee
description: A marquee component continuously scrolls text, images, or videos in an infinite loop, with customizable speed, direction, and responsive design for engaging displays.
component: true
---

## Installation

CLI
Manual

### 1.

Copy and paste the following code into your project’s `components/ui/marquee.tsx` file.

Add the following animations to your global CSS file.

```css
@theme inline {
  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }

  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }
}
```

## Examples

### Vertical

### 3D

## API Reference

| **Prop**                                                                            | **Type**                           | **Default** |
| ----------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| `className` Optional CSS class name to apply custom styles.                         | ~string~                           |             |
| `reverse` Whether to reverse the animation direction.                               | ~boolean~                          | ~false~     |
| `pauseOnHover` Whether to pause the animation on hover.                             | ~boolean~                          | ~false~     |
| `children` Content to be displayed in the marquee.                                  | ~ReactNode~                        |             |
| `vertical` Whether to animate vertically instead of horizontally.                   | ~boolean~                          | ~false~     |
| `repeat` Number of times to repeat the content.                                     | ~number~                           | ~4~         |
| `autoFill` If true, automatically repeats children enough to fill the visible area. | ~boolean~                          |             |
| `ariaLabel` ARIA label for accessibility.                                           | ~string~                           |             |
| `ariaLive` ARIA live region politeness setting.                                     | ~'off' \| 'polite' \| 'assertive'~ | ~'off'~     |
| `ariaRole` ARIA role attribute.                                                     | ~string~                           | ~'marquee'~ |

## Credits

- Inspired by [Magic UI](https://magicui.design/docs/components/marquee).
