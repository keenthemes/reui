---
title: Scroll Area
description: A component that provides a scrollable area with custom scrollbars, built with Base UI components.
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm install @base-ui-components/react
```

Copy and paste the following code into your project's `components/ui/base-scroll-area.tsx` file.

## API Reference

This component is built using [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area) primitives. For detailed information, please visit the full API reference.

### ScrollArea

This component is based on the [Base UI ScrollArea](https://base-ui.com/react/components/scroll-area) primitive and includes the following custom props:

| **Prop**      | **Type**                                                                 | **Default** | **Description**                                       |
| ------------- | ------------------------------------------------------------------------ | ----------- | ----------------------------------------------------- |
| `className`   | ~string~                                                                 |        | Additional CSS classes for the scroll area container. |
| `orientation` | ~enum~  "horizontal" \| "vertical" \| "both"  | "vertical"  | The orientation of the scroll area.                   |

### ScrollBar

A custom scrollbar component that appears when content overflows.

| **Prop**      | **Type**                                                       | **Default** | **Description**                           |
| ------------- | -------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `className`   | ~string~                                                       |        | Additional CSS classes for the scrollbar. |
| `orientation` | ~enum~  "horizontal" \| "vertical"  |        | The orientation of the scrollbar.         |

## Credits

- Built with [Base UI Scroll Area](https://base-ui.com/react/components/scroll-area).