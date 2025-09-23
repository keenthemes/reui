---
title: Tabs
description: A set of layered sections of content—known as tab panels—that are displayed one at a time. Built on top of Base UI Tabs component.
component: true
---

## Installation

  CLI
  Manual

### 1. 

### 2. Install ReUI

Refer to the [Installation Guide](/docs/installation) for detailed instructions on setting up ReUI dependencies in your project.

### 3. Install dependencies

```bash
npm i @base-ui-components/react
```

Copy and paste the following code into your project's `components/ui/base-tabs.tsx` file.

## Examples

### Default

### Button Variant

### Line Variant

### Pill Shape

### With Icons

### With Badges

### Vertical

### Sizes

#### Extra Small

#### Small

#### Medium

#### Large

### Disabled

## API Reference

This component is built using [Base UI Tabs](https://base-ui.com/react/components/tabs) primitives. For detailed information, please visit the full API reference.

### Tabs

The root component that provides context for all tab parts.

| Prop            | Type                         | Default        | Description                            |
| --------------- | ---------------------------- | -------------- | -------------------------------------- |
| `className`     | `string`                     | -              | Additional CSS classes                 |
| `value`         | `string`                     | -              | The controlled value of the active tab |
| `defaultValue`  | `string`                     | -              | The uncontrolled default value         |
| `onValueChange` | `(value: string) => void`    | -              | Callback when active tab changes       |
| `orientation`   | `'horizontal' \| 'vertical'` | `'horizontal'` | The orientation of the tabs            |
| `children`      | `ReactNode`                  | -              | The content of the tabs component      |

### TabsList

The container for tab triggers.

| Prop        | Type                              | Default     | Description                         |
| ----------- | --------------------------------- | ----------- | ----------------------------------- |
| `className` | `string`                          | -           | Additional CSS classes              |
| `variant`   | `'default' \| 'button' \| 'line'` | `'default'` | The visual variant of the tabs list |
| `shape`     | `'default' \| 'pill'`             | `'default'` | The shape of the tabs list          |
| `size`      | `'xs' \| 'sm' \| 'md' \| 'lg'`    | `'md'`      | The size of the tabs                |
| `children`  | `ReactNode`                       | -           | The content of the tabs list        |

### TabsTrigger

The clickable element that activates a tab.

| Prop        | Type        | Default | Description                                |
| ----------- | ----------- | ------- | ------------------------------------------ |
| `className` | `string`    | -       | Additional CSS classes                     |
| `value`     | `string`    | -       | The value of the tab this trigger controls |
| `disabled`  | `boolean`   | `false` | Whether the tab trigger is disabled        |
| `children`  | `ReactNode` | -       | The content of the tab trigger             |

### TabsContent

The content panel for a tab.

| Prop        | Type        | Default | Description                                  |
| ----------- | ----------- | ------- | -------------------------------------------- |
| `className` | `string`    | -       | Additional CSS classes                       |
| `value`     | `string`    | -       | The value of the tab this content belongs to |
| `children`  | `ReactNode` | -       | The content of the tab panel                 |

## Credits

- Built with [Base UI Tabs](https://base-ui.com/react/components/tabs).