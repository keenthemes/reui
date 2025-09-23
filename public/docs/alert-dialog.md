---
title: Alert Dialog
description: A modal dialog that interrupts the user with important content and expects a response.
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

Copy and paste the following code into your project’s `components/ui/alert-dialog.tsx` file.

## Examples

### Destructive

## API Reference

This component is built using [Radix UI Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog) primitives
and includes the following custom props:

### AlertDialog

This component is based on the [AlertDialog.Root](https://www.radix-ui.com/primitives/docs/components/alert-dialog#root) primitive and includes the following custom props:

| **Prop**                                                                                          | **Type**                                                           | **Default** |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------- |
| `variant` Determines the visual style of the alert dialog.             | ~enum~  "info" \| "warning" \| "error"  | ~info~      |
| `dismissable` Controls whether the alert can be dismissed by the user. | ~boolean~                                                          | ~true~      |

### AlertDialogAction

This component is based on the [AlertDialog.Action](https://www.radix-ui.com/primitives/docs/components/alert-dialog#action) primitive and includes the following custom props:

| **Prop**                                                          | **Type**                                                              | **Default** |
| ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----------- |
| `variant` Determines the button style. | ~enum~  "default" \| "outline" \| "ghost"  | ~default~   |

## Credits

- Built with [Radix UI Alert Dialog](https://www.radix-ui.com/primitives/docs/components/alert-dialog).