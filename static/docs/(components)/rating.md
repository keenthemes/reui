## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i class-variance-authority lucide-react
```

Copy and paste the following code into your project's `components/ui/rating.tsx` file.

## Examples

### Decimal

### Show Value

### Editable

### Size

### Statistics

## API Reference

### Rating

The main rating component that displays star ratings and supports interactive input.

| **Prop**                                                                  | **Type**                            | **Default** |
| ------------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `rating` Current rating value (supports decimal values for partial stars) | ~number~                            | ~required~  |
| `maxRating` Maximum rating value (number of stars to show)                | ~number~                            | ~5~         |
| `size` Size variant of the rating component                               | ~enum~ "sm" \| "md" \| "lg"         | ~"md"~      |
| `showValue` Whether to show the numeric rating value                      | ~boolean~                           | ~false~     |
| `editable` Whether the rating is editable (clickable)                     | ~boolean~                           | ~false~     |
| `onRatingChange` Callback function called when rating changes             | ~function~ (rating: number) => void | ~undefined~ |
| `starClassName` Additional class name for the rating value text           | ~string~                            | ~undefined~ |
| `className` Additional class name for the rating container                | ~string~                            | ~undefined~ |
