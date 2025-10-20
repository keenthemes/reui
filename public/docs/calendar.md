---
title: Calendar
description: A date field component that allows users to enter and edit dates.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui react-day-picker date-fns
```

Copy and paste the following code into your project’s `components/ui/calendar.tsx` file.

## Examples

### Multiple Months

## API Reference

This component provides a customizable calendar system built on top of the `react-day-picker` library.

### Calendar

This component is based on the [DayPicker](https://daypicker.dev) component and extends its functionality with custom styling and navigation controls.

| **Prop**                                                                    | **Type**  | **Default** |
| --------------------------------------------------------------------------- | --------- | ----------- |
| `className` Additional class names for styling the calendar container.      | ~string~  |             |
| `classNames` Custom class names to override specific parts of the calendar. | ~Record\~ |             |
| `showOutsideDays` Determines whether to show days from adjacent months.     | ~boolean~ | ~true~      |

## Credits

- Built with [React DayPicker](https://daypicker.dev).
