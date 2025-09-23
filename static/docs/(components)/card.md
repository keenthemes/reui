## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/card.tsx` file.

## Examples

### Accent

## API Reference

This component provides a customizable card system with various sections and styles.

### Card

The main container component that provides context and styling for all card elements.

| **Prop**                                                           | **Type**                     | **Default** |
| ------------------------------------------------------------------ | ---------------------------- | ----------- |
| `variant` The visual style variant of the card.                    | ~enum~ "default" \| "accent" | ~"default"~ |
| `className` Additional class names for styling the card container. | ~string~                     |             |

### CardHeader

A component for the header section of the card. Inherits variant from Card context.

| **Prop**                                                        | **Type** | **Default** |
| --------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card header. | ~string~ |             |

### CardHeading

A container for the card's heading content with consistent spacing.

| **Prop**                                                         | **Type** | **Default** |
| ---------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card heading. | ~string~ |             |

### CardToolbar

A container for action items in the card header with flexbox layout.

| **Prop**                                                         | **Type** | **Default** |
| ---------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card toolbar. | ~string~ |             |

### CardTitle

A heading component for the card's title with default typography styles.

| **Prop**                                                       | **Type** | **Default** |
| -------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card title. | ~string~ |             |

### CardDescription

A component for descriptive text with muted styling.

| **Prop**                                                             | **Type** | **Default** |
| -------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card description. | ~string~ |             |

### CardContent

The main content area of the card. Inherits variant from Card context.

| **Prop**                                                         | **Type** | **Default** |
| ---------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card content. | ~string~ |             |

### CardTable

A grid container for table layouts within the card. Inherits variant from Card context.

| **Prop**                                                       | **Type** | **Default** |
| -------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card table. | ~string~ |             |

### CardFooter

The footer section of the card. Inherits variant from Card context.

| **Prop**                                                        | **Type** | **Default** |
| --------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the card footer. | ~string~ |             |
