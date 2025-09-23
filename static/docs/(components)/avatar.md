## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project’s `components/ui/avatar.tsx` file.

## Examples

### Fallback

### Indicator

### Status

### Badge

### Size

### Group

### Users

## API Reference

This component builds on the Radix UI Avatar primitives, adding customization options such as indicators and status.

### Avatar

This component is based on the [Avatar.Root](https://www.radix-ui.com/primitives/docs/components/avatar#root) primitive.

| **Prop**                                                             | **Type** | **Default** |
| -------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the avatar container. | ~string~ |             |

### AvatarImage

This component is based on the [Avatar.Image](https://www.radix-ui.com/primitives/docs/components/avatar#image) primitive.

| **Prop**                                                         | **Type** | **Default** |
| ---------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the avatar image. | ~string~ |             |

### AvatarFallback

This component is based on the [Avatar.Fallback](https://www.radix-ui.com/primitives/docs/components/avatar#fallback) primitive.

| **Prop**                                                             | **Type** | **Default** |
| -------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the fallback content. | ~string~ |             |

### AvatarIndicator

This is a custom component used to display an indicator within the avatar.

| **Prop**                                                      | **Type** | **Default** |
| ------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the indicator. | ~string~ |             |

### AvatarStatus

This is a custom component for displaying a status indicator on the avatar.

| **Prop**                                                             | **Type**                                         | **Default** |
| -------------------------------------------------------------------- | ------------------------------------------------ | ----------- |
| `variant` Specifies the status of the avatar.                        | ~enum~ "online" \| "offline" \| "busy" \| "away" | `online`    |
| `className` Additional class names for styling the status indicator. | ~string~                                         |             |

## Credits

- Built with [Radix UI Avatar](https://www.radix-ui.com/primitives/docs/components/avatar).
