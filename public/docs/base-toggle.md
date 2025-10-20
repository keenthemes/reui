---
title: Toggle
description: A two-state button that can be either on or off.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i @base-ui-components/react/toggle
```

Copy and paste the following code into your project's `components/ui/base-toggle.tsx` file.

## Examples

### Text

### Outline

### Size

## API Reference

This component is based on [Base UI Toggle](https://base-ui.com/react/components/toggle).

### Toggle Props

| Prop              | Type                                                                  | Default | Description                                                                                             |
| :---------------- | :-------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------ |
| `defaultPressed`  | `boolean`                                                             | `false` | Whether the toggle button is currently pressed. This is the uncontrolled counterpart of `pressed`.      |
| `pressed`         | `boolean`                                                             | -       | Whether the toggle button is currently pressed. This is the controlled counterpart of `defaultPressed`. |
| `onPressedChange` | `(pressed: boolean, eventDetails: Toggle.ChangeEventDetails) => void` | -       | Callback fired when the pressed state is changed.                                                       |
| `disabled`        | `boolean`                                                             | `false` | Whether the component should ignore user interaction.                                                   |
| `className`       | `string \| ((state: Toggle.State) => string)`                         | -       | CSS class applied to the element, or a function that returns a class based on the component's state.    |

### Toggle Data Attributes

| Attribute      | Type | Description                                |
| :------------- | :--- | :----------------------------------------- |
| `data-pressed` | -    | Present when the toggle button is pressed. |
