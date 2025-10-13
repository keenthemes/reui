---
title: Breadcrumb
description: Displays a hierarchy of links to the current page or resource in an application.
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

Copy and paste the following code into your project’s `components/ui/breadcrumb.tsx` file.

## Examples

### Icon

### Separator

### Dropdown

### Card

## API Reference

This component provides a customizable breadcrumb system for displaying a hierarchy of links.

### Breadcrumb

This component is a flexible container for displaying breadcrumb items.

| **Prop**                                                                                            | **Type**          | **Default**       |
| --------------------------------------------------------------------------------------------------- | ----------------- | ----------------- |
| `className` Additional class names for styling the breadcrumb container. | ~string~          |              |
| `separator` The character or element used as a separator.                | ~React.ReactNode~ | `` |

### BreadcrumbList

This component is used to display a list of breadcrumb items.

| **Prop**                                                                                       | **Type** | **Default** |
| ---------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the breadcrumb list. | ~string~ |        |

### BreadcrumbItem

This component is used to display an individual breadcrumb item.

| **Prop**                                                                                       | **Type** | **Default** |
| ---------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the breadcrumb item. | ~string~ |        |

### BreadcrumbLink

This component is used to display a link within a breadcrumb item.

| **Prop**                                                                                              | **Type**  | **Default** |
| ----------------------------------------------------------------------------------------------------- | --------- | ----------- |
| `className` Additional class names for styling the breadcrumb link.        | ~string~  |        |
| `href` The URL that the breadcrumb link points to.                         | ~string~  | ~#~         |
| `asChild` Renders the link as a child element, using the `Slot` component. | ~boolean~ | ~false~     |

### BreadcrumbPage

This component is used to display the current page in the breadcrumb.

| **Prop**                                                                                       | **Type** | **Default** |
| ---------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the breadcrumb page. | ~string~ |        |

### BreadcrumbSeparator

This component is used to display a separator between breadcrumb items.

| **Prop**                                                                                            | **Type** | **Default** |
| --------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the breadcrumb separator. | ~string~ |        |

### BreadcrumbEllipsis

This component is used to display an ellipsis in the breadcrumb.

| **Prop**                                                                                           | **Type** | **Default** |
| -------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Additional class names for styling the breadcrumb ellipsis. | ~string~ |        |

## Credits

- Built with [Radix UI Slot](https://www.radix-ui.com/primitives/docs/utilities/slot).