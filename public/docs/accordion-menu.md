---
title: Accordion Menu
description: A flexible accordion menu that supports multi-level navigation and integrates with your router to manage active states based on the current route.
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

Copy and paste the following code into your project’s `components/ui/accordion-menu.tsx` file.

## Examples

### States

### Sub-menu

### Multi-expand

### Multi-level

### Router

## API Reference

This component is built using [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion) primitives. For detailed information please visit the full API reference.

### AccordionMenu

This component provides the context for the accordion menu and includes the following custom props:

| **Prop**                                                                                                                                                                                                                                                                                | **Type**                          | **Default** |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ----------- |
| `selectedValue` Sets the default selected accordion item(s) by value. Use a string for `type=single` mode, an array for `type=multiple` mode                                                                                                                 | ~string \| string[] \| undefined~ |        |
| `matchPath` A callback to integrate with a router, determining if a given path matches the current route. Returns `true` if the path matches, `false` otherwise. Use to sync accordion menu state (e.g., highlighting or expanding items) with routing logic | ~(href: string) => boolean~       | ~false~     |
| `classNames` An object that lets you customize the CSS class names for different parts of an accordion menu component                                                                                                                                        | ~object: AccordionMenuClassNames~ |        |

#### Class Names Props - `classNames`

| **Prop**                                                                                                                        | **Type** | **Default** |
| ------------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `group` A CSS class name applied to the container grouping related menu sections.                    | ~string~ |        |
| `separator` A CSS class name for the visual separator between menu items.                            | ~string~ |        |
| `item` A CSS class name for each individual accordion item.                                          | ~string~ |        |
| `sub` A CSS class name for a submenu container within the menu.                                      | ~string~ |        |
| `subTrigger` A CSS class name for the element that triggers the opening or closing of a submenu.     | ~string~ |        |
| `subContent` A CSS class name for the content area of a submenu that appears when expanded.          | ~string~ |        |
| `indicator` A CSS class name for the indicator element that signals the expandable state of an item. | ~string~ |        |

### AccordionMenuGroup

This component is used to group menu items.

| **Prop**                                                                                       | **Type** | **Default** |
| ---------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Determines the class names of the accordion menu group. | ~string~ |        |

### AccordionMenuLabel

This component is used to label menu groups and includes the following custom props:

| **Prop**                                                                                       | **Type** | **Default** |
| ---------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Determines the class names of the accordion menu label. | ~string~ |        |

### AccordionMenuSeparator

This component is used to separate menu items and includes the following custom props:

| **Prop**                                                                                           | **Type** | **Default** |
| -------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Determines the class names of the accordion menu separator. | ~string~ |        |

### AccordionMenuItem

This component is used to create individual menu items and includes the following custom props:

| **Prop**                                                                                | **Type**                                                       | **Default** |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ----------- |
| `variant` Determines the variant of the accordion menu item. | ~enum~  "default" \| "destructive"  | ~default~   |

### AccordionMenuIndicator

This component is used to display indicators for menu items and includes the following custom props:

| **Prop**                                                                                           | **Type** | **Default** |
| -------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `className` Determines the class names of the accordion menu indicator. | ~string~ |        |

## Credits

- Built with [Radix UI Accordion](https://www.radix-ui.com/primitives/docs/components/accordion).