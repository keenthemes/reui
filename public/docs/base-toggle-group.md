---
title: Toggle Group
description: A set of two-state buttons that can be toggled on or off.
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm i @base-ui-components/react/toggle-group
```

Copy and paste the following code into your project's `components/ui/base-toggle-group.tsx` file.

## Examples

### Single

### Outline

### Size

## API Reference

### ToggleGroup Props

| Prop             | Type                                                                         | Default        | Description                                                                                                                                                                    |
| :--------------- | :--------------------------------------------------------------------------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `defaultValue`   | `any[]`                                                                      | -              | The open state of the toggle group represented by an array of the values of all pressed toggle buttons. This is the uncontrolled counterpart of `value`.                       |
| `value`          | `any[]`                                                                      | -              | The open state of the toggle group represented by an array of the values of all pressed toggle buttons. This is the controlled counterpart of `defaultValue`.                  |
| `onValueChange`  | `(groupValue: any[], eventDetails: Toggle.Group.ChangeEventDetails) => void` | -              | Callback fired when the pressed states of the toggle group changes.                                                                                                            |
| `toggleMultiple` | `boolean`                                                                    | `false`        | When `false` only one item in the group can be pressed. If any item in the group becomes pressed, the others will become unpressed. When `true` multiple items can be pressed. |
| `disabled`       | `boolean`                                                                    | `false`        | Whether the toggle group should ignore user interaction.                                                                                                                       |
| `loop`           | `boolean`                                                                    | `true`         | Whether to loop keyboard focus back to the first item when the end of the list is reached while using the arrow keys.                                                          |
| `orientation`    | `Orientation`                                                                | `'horizontal'` | -                                                                                                                                                                              |
| `className`      | `string \| ((state: Toggle.Group.State) => string)`                          | -              | CSS class applied to the element, or a function that returns a class based on the component's state.                                                                           |

### ToggleGroup Data Attributes

| Attribute          | Type                         | Description                                                                                        |
| :----------------- | :--------------------------- | :------------------------------------------------------------------------------------------------- |
| `data-orientation` | `'horizontal' \| 'vertical'` | Indicates the orientation of the toggle group.                                                     |
| `data-disabled`    | -                            | Present when the toggle group is disabled.                                                         |
| `data-multiple`    | -                            | Present when the toggle group allows multiple buttons to be in the pressed state at the same time. |

## Credits

- Built with [Base UI Toggle Group](https://base-ui.com/react/components/toggle-group).