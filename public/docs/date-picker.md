---
title: Date Picker
description: A date input component that combines a calendar popover with an input field.
component: true
---

## Installation

The Date Picker is built using a composition of the [Popover](/docs/popover) and the [Calendar](/docs/calendar) components.

## Examples

### Date & Time

### Range

### Presets

### Form

## API Reference

This component is built using [react-day-picker](https://react-day-picker.js.org/) and [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) primitives. For detailed information about the calendar functionality, please visit the react-day-picker documentation.

### Calendar

This component is based on the [DayPicker](https://react-day-picker.js.org/basics/customization) component from react-day-picker. For all available props, refer to the react-day-picker documentation. The component includes the following custom styling props:

| **Prop**                                                               | **Type** | **Default**        |
| ---------------------------------------------------------------------- | -------- | ------------------ |
| `className` Additional class names for styling the calendar container. | ~string~ | ~undefined~        |
| `classNames` Custom class names for individual calendar elements.      | ~object~ | ~See calendar.tsx~ |

### DatePickerTrigger

The trigger button that opens the date picker popover.

| **Prop**                                                           | **Type**  | **Default**     |
| ------------------------------------------------------------------ | --------- | --------------- |
| `asInput` Style the trigger as an input field.                     | ~boolean~ | ~false~         |
| `placeholder` Placeholder text when no date is selected.           | ~string~  | ~"Pick a date"~ |
| `className` Additional class names for styling the trigger button. | ~string~  | ~undefined~     |

### DatePickerContent

The popover content that contains the calendar. This component extends Radix UI's Popover.Content.

| **Prop**                                                            | **Type**                            | **Default** |
| ------------------------------------------------------------------- | ----------------------------------- | ----------- |
| `className` Additional class names for styling the popover content. | ~string~                            | ~undefined~ |
| `align` Alignment of the popover relative to the trigger.           | ~enum~ "start" \| "center" \| "end" | ~"center"~  |

### DatePickerPresets

A component for displaying preset date ranges.

| **Prop**                                                              | **Type**                     | **Default** |
| --------------------------------------------------------------------- | ---------------------------- | ----------- |
| `presets` Array of preset date ranges.                                | ~Array\~                     |             |
| `onSelect` Callback function when a preset is selected.               | ~(range: DateRange) => void~ |             |
| `className` Additional class names for styling the presets container. | ~string~                     | ~undefined~ |

## Credits

- Built with [React DayPicker](https://daypicker.dev/).
- Built with [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover).
