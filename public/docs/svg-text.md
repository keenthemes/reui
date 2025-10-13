---
title: SVG Text
description: Display text with animated SVG backgrounds. Perfect for creating dynamic text effects with custom SVG graphics and animations.
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/svg-text.tsx` file.

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### SVGText

| **Prop**                                                               | **Type**           | **Default** |
| ---------------------------------------------------------------------- | ------------------ | ----------- |
| `svg` SVG content to display inside the text mask.                     | ~ReactNode~        |             |
| `children` Text content to be masked and displayed.                    | ~ReactNode~        |             |
| `className` CSS class for the container element.                       | ~string~           |             |
| `fontSize` Font size for the text mask in CSS units or viewport width. | ~string \| number~ | ~"20vw"~    |
| `fontWeight` Font weight for the text mask.                            | ~string \| number~ | ~"bold"~    |
| `as` HTML element type to render for the container.                    | ~ElementType~      | ~"div"~     |

## Credits

- Built with [Motion](https://motion.dev/).
