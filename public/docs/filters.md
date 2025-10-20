---
title: Filters
description: A comprehensive filtering system with multiple filter types, operators, and visual indicators for data organization.
component: true
---

## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/filters.tsx` file.

## Examples

### Debug

### Add Button

### Solid Style

### Radius Full

### Size

### Custom

### Data Grid

### Async

### Nuqs

### Internationalization

## API Reference

This section documents the public API surface of the Filters component.

### Filters

The main Filters component provides a comprehensive filtering system with support for multiple field types, operators, and visual indicators.

| **Prop**                                                                | **Type**                                                                                       | **Default** |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------- |
| `filters` Array of active filters to display.                           | ~Array~ Array\>                                                                                |             |
| `fields` Field configuration for available filter options.              | ~FilterFieldsConfig\~ Union type supporting both flat arrays and grouped field configurations. |             |
| `onChange` Callback function triggered when filters change.             | ~(filters: Filter\[]) => void~ Function that receives the updated filters array.               |             |
| `className` Additional class names for styling the filters container.   | ~string~                                                                                       |             |
| `showAddButton` Whether to show the add filter button.                  | ~boolean~                                                                                      | ~true~      |
| `addButtonText` Custom text for the add filter button.                  | ~string~                                                                                       |             |
| `addButtonIcon` Custom icon for the add filter button.                  | ~ReactNode~                                                                                    |             |
| `addButtonClassName` Additional class names for the add filter button.  | ~string~                                                                                       |             |
| `addButton` Custom add button component.                                | ~ReactNode~                                                                                    |             |
| `variant` Visual style variant for the filters.                         | ~enum~ "solid" \| "outline"                                                                    | ~"outline"~ |
| `size` Size variant for the filters.                                    | ~enum~ "sm" \| "md" \| "lg"                                                                    | ~"md"~      |
| `radius` Border radius variant for the filters.                         | ~enum~ "md" \| "full"                                                                          | ~"md"~      |
| `i18n` Internationalization configuration for labels and messages.      | ~Partial\~ Partial configuration object for customizing text and labels.                       |             |
| `showSearchInput` Whether to show search input in field selection.      | ~boolean~                                                                                      | ~true~      |
| `cursorPointer` Whether to show pointer cursor on interactive elements. | ~boolean~                                                                                      | ~true~      |
| `trigger` Custom trigger element for the add filter popover.            | ~ReactNode~                                                                                    |             |
| `allowMultiple` Whether to allow multiple filters for the same field.   | ~boolean~                                                                                      | ~true~      |
| `popoverContentClassName` Additional class names for popover content.   | ~string~                                                                                       |             |

### Types

Public types that you’ll commonly use when integrating Filters.

#### Filter

| **Prop**   | **Type**        | **Default** |
| ---------- | --------------- | ----------- |
| `id`       | ~string~        |             |
| `field`    | ~string~        |             |
| `operator` | ~string~        |             |
| `values`   | ~Array~ Array\  |             |

#### FilterFieldConfig

Key configuration for defining fields.

| **Prop**                                                              | **Type**                                                                                                                                                                                      | **Default** |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `key` Unique key for the field.                                       | ~string~                                                                                                                                                                                      |             |
| `label` Label for the field.                                          | ~string~                                                                                                                                                                                      |             |
| `icon` Icon for the field.                                            | ~ReactNode~                                                                                                                                                                                   |             |
| `type` Type of the field.                                             | ~enum~ "select" \| "multiselect" \| "date" \| "daterange" \| "text" \| "number" \| "numberrange" \| "boolean" \| "email" \| "url" \| "tel" \| "time" \| "datetime" \| "custom" \| "separator" |             |
| `options` Options for the field.                                      | ~Array~ Array\>                                                                                                                                                                               |             |
| `operators` Operators for the field.                                  | ~Array~ Array\                                                                                                                                                                                |             |
| `placeholder` Placeholder text for input field.                       | ~string~                                                                                                                                                                                      |             |
| `searchable` Enables search for select and multiselect fields.        | ~boolean~                                                                                                                                                                                     |             |
| `className` Additional class names for the field.                     | ~string~                                                                                                                                                                                      |             |
| `defaultOperator` Default operator for the field.                     | ~string~                                                                                                                                                                                      |             |
| `popoverContentClassName` Additional class names for popover content. | ~string~                                                                                                                                                                                      |             |
| `maxSelections` Maximum selections for multiselect.                   | ~number~                                                                                                                                                                                      |             |
| `min` Minimum numeric value.                                          | ~number~                                                                                                                                                                                      |             |
| `max` Maximum numeric value.                                          | ~number~                                                                                                                                                                                      |             |
| `step` Numeric input step.                                            | ~number~                                                                                                                                                                                      |             |
| `prefix` Prefix element/text for input.                               | ~string \| ReactNode~                                                                                                                                                                         |             |
| `suffix` Suffix element/text for input.                               | ~string \| ReactNode~                                                                                                                                                                         |             |
| `pattern` Validation regex (string form).                             | ~string~                                                                                                                                                                                      |             |
| `validation` Custom validator function.                               | ~(value: unknown) => boolean~                                                                                                                                                                 |             |
| `allowCustomValues` Allow freeform values in selects.                 | ~boolean~                                                                                                                                                                                     |             |
| `onLabel` Custom label for boolean on state.                          | ~string~                                                                                                                                                                                      |             |
| `offLabel` Custom label for boolean off state.                        | ~string~                                                                                                                                                                                      |             |

#### FilterFieldsConfig

`FilterFieldConfig[] | FilterFieldGroup[]` Union type supporting both flat arrays and grouped field configurations.

#### FilterFieldGroup

| **Prop** | **Type**        | **Default** |
| -------- | --------------- | ----------- |
| `group`  | ~string~        |             |
| `fields` | ~Array~ Array\> |             |

#### FilterOption

| **Prop** | **Type**    | **Default** |
| -------- | ----------- | ----------- |
| `value`  | ~T~         |             |
| `label`  | ~string~    |             |
| `icon`   | ~ReactNode~ |             |

#### FilterOperator

| **Prop**           | **Type**  | **Default** |
| ------------------ | --------- | ----------- |
| `value`            | ~string~  |             |
| `label`            | ~string~  |             |
| `supportsMultiple` | ~boolean~ |             |

#### FilterI18nConfig (Partial)

You can pass a partial config via the `i18n` prop. Tables below list all keys.

| **Key**             | **Type** | **Default**                         |
| ------------------- | -------- | ----------------------------------- |
| `addFilter`         | ~string~ | ~"Add filter"~                      |
| `searchFields`      | ~string~ | ~"Search fields..."~                |
| `noFieldsFound`     | ~string~ | ~"No fields found."~                |
| `noResultsFound`    | ~string~ | ~"No results found."~               |
| `select`            | ~string~ | ~"Select..."~                       |
| `true`              | ~string~ | ~"True"~                            |
| `false`             | ~string~ | ~"False"~                           |
| `min`               | ~string~ | ~"Min"~                             |
| `max`               | ~string~ | ~"Max"~                             |
| `to`                | ~string~ | ~"to"~                              |
| `typeAndPressEnter` | ~string~ | ~"Type and press Enter to add tag"~ |
| `selected`          | ~string~ | ~"selected"~                        |
| `selectedCount`     | ~string~ | ~"selected"~                        |
| `percent`           | ~string~ | ~"%"~                               |
| `defaultCurrency`   | ~string~ | ~"$"~                               |
| `defaultColor`      | ~string~ | ~"#000000"~                         |
| `addFilterTitle`    | ~string~ | ~"Add filter"~                      |

##### operators

| **Key**         | **Type** | **Default**          |
| --------------- | -------- | -------------------- |
| `is`            | ~string~ | ~"is"~               |
| `isNot`         | ~string~ | ~"is not"~           |
| `isAnyOf`       | ~string~ | ~"is any of"~        |
| `isNotAnyOf`    | ~string~ | ~"is not any of"~    |
| `includesAll`   | ~string~ | ~"includes all"~     |
| `excludesAll`   | ~string~ | ~"excludes all"~     |
| `before`        | ~string~ | ~"before"~           |
| `after`         | ~string~ | ~"after"~            |
| `between`       | ~string~ | ~"between"~          |
| `notBetween`    | ~string~ | ~"not between"~      |
| `contains`      | ~string~ | ~"contains"~         |
| `notContains`   | ~string~ | ~"does not contain"~ |
| `startsWith`    | ~string~ | ~"starts with"~      |
| `endsWith`      | ~string~ | ~"ends with"~        |
| `isExactly`     | ~string~ | ~"is exactly"~       |
| `equals`        | ~string~ | ~"equals"~           |
| `notEquals`     | ~string~ | ~"not equals"~       |
| `greaterThan`   | ~string~ | ~"greater than"~     |
| `lessThan`      | ~string~ | ~"less than"~        |
| `overlaps`      | ~string~ | ~"overlaps"~         |
| `includes`      | ~string~ | ~"includes"~         |
| `excludes`      | ~string~ | ~"excludes"~         |
| `includesAllOf` | ~string~ | ~"includes all of"~  |
| `includesAnyOf` | ~string~ | ~"includes any of"~  |
| `empty`         | ~string~ | ~"is empty"~         |
| `notEmpty`      | ~string~ | ~"is not empty"~     |

##### placeholders

| **Key**       | **Type**                        | **Default**                                       |
| ------------- | ------------------------------- | ------------------------------------------------- |
| `enterField`  | ~(fieldType: string) => string~ | ~"Enter &#123;fieldType&#125;..."~                |
| `selectField` | ~string~                        | ~"Select..."~                                     |
| `searchField` | ~(fieldName: string) => string~ | ~"Search &#123;fieldName.toLowerCase()&#125;..."~ |
| `enterKey`    | ~string~                        | ~"Enter key..."~                                  |
| `enterValue`  | ~string~                        | ~"Enter value..."~                                |

##### helpers

| **Key**          | **Type**                       | **Default**                       |
| ---------------- | ------------------------------ | --------------------------------- |
| `formatOperator` | ~(operator: string) => string~ | ~replace underscores with spaces~ |

##### validation

| **Key**        | **Type** | **Default**              |
| -------------- | -------- | ------------------------ |
| `invalidEmail` | ~string~ | ~"Invalid email format"~ |
| `invalidUrl`   | ~string~ | ~"Invalid URL format"~   |
| `invalidTel`   | ~string~ | ~"Invalid phone format"~ |
| `invalid`      | ~string~ | ~"Invalid input format"~ |

#### Field Types

The Filters component supports various field types, each with specific behaviors and operators:

| **Field Type** | **Operators**                                                                                           | **Input Type**     | **Description**                                            |
| -------------- | ------------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------- |
| `text`         | ~enum~ "contains" \| "not_contains" \| "starts_with" \| "ends_with" \| "is" \| "empty" \| "not_empty"   | ~Text Input~       | Text input with optional pattern validation and search.    |
| `number`       | ~enum~ "equals" \| "not_equals" \| "greater_than" \| "less_than" \| "between" \| "empty" \| "not_empty" | ~Number Input~     | Number input with min/max/step and optional prefix/suffix. |
| `date`         | ~enum~ "before" \| "after" \| "is" \| "is_not" \| "empty" \| "not_empty"                                | ~Date Picker~      | Calendar-based date selection.                             |
| `daterange`    | ~enum~ "between" \| "not_between" \| "empty" \| "not_empty"                                             | ~Date Range~       | Two date pickers with "to" separator.                      |
| `select`       | ~enum~ "is" \| "is_not" \| "empty" \| "not_empty"                                                       | ~Dropdown~         | Searchable dropdown with predefined options.               |
| `multiselect`  | ~enum~ "is_any_of" \| "is_not_any_of" \| "includes_all" \| "excludes_all" \| "empty" \| "not_empty"     | ~Multi-Select~     | Multi-select dropdown with search and limits.              |
| `boolean`      | ~enum~ "is" \| "is_not" \| "empty" \| "not_empty"                                                       | ~Switch~           | Toggle switch with custom on/off labels.                   |
| `email`        | ~enum~ "contains" \| "not_contains" \| "starts_with" \| "ends_with" \| "is" \| "empty" \| "not_empty"   | ~Email Input~      | Email input with built-in validation.                      |
| `url`          | ~enum~ "contains" \| "not_contains" \| "starts_with" \| "ends_with" \| "is" \| "empty" \| "not_empty"   | ~URL Input~        | URL input with validation.                                 |
| `tel`          | ~enum~ "contains" \| "not_contains" \| "starts_with" \| "ends_with" \| "is" \| "empty" \| "not_empty"   | ~Phone Input~      | Phone input with validation.                               |
| `time`         | ~enum~ "before" \| "after" \| "is" \| "between" \| "empty" \| "not_empty"                               | ~Time Picker~      | Time selection component.                                  |
| `datetime`     | ~enum~ "before" \| "after" \| "is" \| "between" \| "empty" \| "not_empty"                               | ~DateTime Picker~  | Combined date and time selection.                          |
| `custom`       | ~Custom~                                                                                                | ~Custom Component~ | Provided by `customRenderer`.                              |
| `separator`    | ~None~                                                                                                  | ~Visual Separator~ | Non-interactive separator.                                 |

## Credits

- Built with [Radix UI](https://www.radix-ui.com/) primitives for accessibility.
- Built with [Class Variance Authority](https://cva.style/) for styling variants.
- Built with [Lucide React](https://lucide.dev/) for icons.
