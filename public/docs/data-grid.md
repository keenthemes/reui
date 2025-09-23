---
title: Data Grid
description: A powerful data grid component built on top of TanStack Table v8 with features like sorting, filtering, pagination, and drag & drop support.
component: true
---

## Installation

  CLI
  Manual

### 1. 
Install the following dependencies:

```bash
npm i radix-ui @tanstack/react-table
```

To enable support for drag-and-drop functionality for columns and rows, install the following packages:

```bash
npm i @dnd-kit/core @dnd-kit/sortable @dnd-kit/modifiers @dnd-kit/utilities
```

Copy and paste the following code into your project’s `components/ui/data-grid.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-table.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-pagination.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-column-header.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-column-filter.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-column-visibility.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-table-dnd.tsx` file.

Copy and paste the following code into your project’s `components/ui/data-grid-table-dnd-rows.tsx` file.

## Examples

### Cell Border

### Dense Table

### Light

### Striped

### Auto Width

### Row Selection

### Expandable Row

### Sub Data Grid

### Column Icons

### Sortable Columns

### Movable Columns

### Draggable Columns

### Draggable Rows

### Resizable Columns

### Pinnable Columns

### Sticky Header

### Column Controls

### Card Container

### Column Visibility

### Loading Skeleton

### CRUD

## API Reference

This section provides a comprehensive overview of the data grid components, detailing their custom props and linking to relevant documentation.

### DataGrid

This component is based on the [DataGrid](https://tanstack.com/table/latest/docs/guide/data) from [TanStack Table](https://tanstack.com/table/latest) and includes the following custom props:

| **Prop**                                                                                           | **Type**                                                    | **Default**           |
| -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | --------------------- |
| `className` Additional class names for styling the data grid container. | ~string~                                                    |                  |
| `table` The TanStack Table instance to be used by the data grid.        | ~Table\~                                             |                  |
| `recordCount` Total number of records in the data grid.                 | ~number~                                                    |                  |
| `children` Child components to be rendered within the data grid.        | ~ReactNode~                                                 |                  |
| `onRowClick` Callback function triggered when a row is clicked.         | ~(row: TData) => void~                                      |                  |
| `isLoading` Indicates if the data grid is in a loading state.           | ~boolean~                                                   | ~false~               |
| `loadingMode` Specifies the loading mode for the data grid.             | ~enum~  "skeleton" \| "spinner"  | ~skeleton~            |
| `loadingMessage` Message displayed during loading state.                | ~ReactNode \| string~                                       |                  |
| `emptyMessage` Message displayed when there are no records.             | ~ReactNode \| string~                                       | ~"No data available"~ |
| `tableLayout` Configuration for the table layout.                       | ~object~                                                    | See below             |
| `tableClassNames` Custom class names for table elements.                | ~object~                                                    | See below             |

#### Table Layout Props - `tableLayout`

| **Prop**                                                                           | **Type**            | **Default** |
| ---------------------------------------------------------------------------------- | ------------------- | ----------- |
| `dense` Controls compact table layout.                  | ~boolean~           | ~false~     |
| `cellBorder` Enables borders between cells.             | ~boolean~           | ~false~     |
| `rowBorder` Enables borders between rows.               | ~boolean~           | ~true~      |
| `rowRounded` Applies rounded corners to rows.           | ~boolean~           | ~false~     |
| `stripped` Enables striped rows.                        | ~boolean~           | ~false~     |
| `headerBackground` Shows header background.             | ~boolean~           | ~true~      |
| `headerBorder` Shows header border.                     | ~boolean~           | ~true~      |
| `headerSticky` Makes header sticky.                     | ~boolean~           | ~false~     |
| `width` Sets table width mode.                          | ~'auto' \| 'fixed'~ | ~'fixed'~   |
| `layout` Sets table width mode.                         | object              | ~'fixed'~   |
| `columnsVisibility` Enables column visibility controls. | ~boolean~           | ~false~     |
| `columnsResizable` Enables column resizing.             | ~boolean~           | ~false~     |
| `columnsPinnable` Enables column pinning.               | ~boolean~           | ~false~     |
| `columnsMovable` Enables column moving.                 | ~boolean~           | ~false~     |
| `columnsDraggable` Enables column drag & drop.          | ~boolean~           | ~false~     |
| `rowsDraggable` Enables row drag & drop.                | ~boolean~           | ~false~     |

#### Table Class Names - `tableClassNames`

| **Prop**                                                           | **Type** | **Default**                                             |
| ------------------------------------------------------------------ | -------- | ------------------------------------------------------- |
| `base` Base class for the table.        | ~string~ |                                                    |
| `header` Class for the header section.  | ~string~ |                                                    |
| `headerRow` Class for header rows.      | ~string~ |                                                    |
| `headerSticky` Class for sticky header. | ~string~ | ~"sticky top-0 z-10 bg-background/90 backdrop-blur-xs"~ |
| `body` Class for the table body.        | ~string~ |                                                    |
| `bodyRow` Class for body rows.          | ~string~ |                                                    |
| `footer` Class for the footer section.  | ~string~ |                                                    |
| `edgeCell` Class for edge cells.        | ~string~ |                                                    |

### DataGridColumnFilter

This component provides filtering capabilities for data grid columns. It utilizes [TanStack Table Columns](https://tanstack.com/table/latest/docs/guide/columns) for column management and filtering.

| **Prop**                                                                       | **Type**                                                                                                                               | **Default** |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| `column` The column to which the filter is applied. | ~Column\~                                                                                                               |        |
| `title` Title of the filter popover.                | ~string~                                                                                                                               |        |
| `options` Filter options available for the column.  | ~Array~  Array\ \}>  |        |

### DataGridColumnHeader

This component provides a header for data grid columns, including sorting and pinning controls. It is built on top of [TanStack Table Header](https://tanstack.com/table/latest/docs/guide/headers) for efficient data management.

| **Prop**                                                                          | **Type**                 | **Default** |
| --------------------------------------------------------------------------------- | ------------------------ | ----------- |
| `column` The column for which the header is displayed. | ~Column\~ |        |
| `title` Title of the column header.                    | ~string~                 |        |
| `icon` Icon displayed in the column header.            | ~ReactNode~              |        |
| `filter` Filter component for the column header.       | ~ReactNode~              |        |

### DataGridColumnVisibility

This component provides controls for toggling the visibility of data grid columns. It utilizes [TanStack Table Column Visibility](https://tanstack.com/table/latest/docs/guide/column-visibility) for managing column visibility.

| **Prop**                                                                                            | **Type**        | **Default** |
| --------------------------------------------------------------------------------------------------- | --------------- | ----------- |
| `table` The table instance to which the visibility controls are applied. | ~Table\~ |        |
| `trigger` The trigger element for the visibility dropdown.               | ~ReactNode~     |        |

### DataGridPagination

This component provides pagination controls for the data grid. It is built on top of [TanStack Table Pagination](https://tanstack.com/table/latest/docs/api/features/pagination) for efficient data management.

| **Prop**                                                                                                   | **Type**    | **Default**                     |
| ---------------------------------------------------------------------------------------------------------- | ----------- | ------------------------------- |
| `sizes` Array of page sizes available for selection.                            | ~number[]~  | ~[5, 10, 25, 50, 100]~          |
| `sizesLabel` Label for the page size selector.                                  | ~string~    | ~"Show"~                        |
| `sizesDescription` Description text for the page size selector.                 | ~string~    | ~"per page"~                    |
| `sizesInfo` Additional info text for the page size selector.                    | ~string~    |                            |
| `sizesSkeleton` Skeleton component to display while loading page size selector. | ~ReactNode~ |                            |
| `more` Enables pagination grouping with ellipsis.                               | ~boolean~   | ~false~                         |
| `moreLimit` Number of page buttons to show before using ellipsis.               | ~number~    | ~5~                             |
| `info` Template for displaying pagination information.                          | ~string~    | ~"\{from} - \{to} of \{count}"~ |
| `infoSkeleton` Skeleton component to display while loading pagination info.     | ~ReactNode~ |                            |
| `className` Additional class names for styling the pagination container.        | ~string~    |                            |
| `rowsPerPageLabel` Label text for the rows per page selector.                   | ~string~    | ~"Rows per page"~               |
| `previousPageLabel` Screen reader text for the previous page button.            | ~string~    | ~"Go to previous page"~         |
| `nextPageLabel` Screen reader text for the next page button.                    | ~string~    | ~"Go to next page"~             |
| `ellipsisText` Text displayed in ellipsis buttons for pagination.               | ~string~    | ~"..."~                         |

### DataGridTableDnd

This component provides drag-and-drop functionality for data grid rows and columns using [Dnd Kit](https://dndkit.com/).

| **Prop**                                                                                          | **Type**                        | **Default** |
| ------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `handleDragEnd` Callback function when a drag-and-drop operation ends. | ~(event: DragEndEvent) => void~ |        |

### DataGridTable

This component provides the table structure for the data grid, including headers, rows, and cells. It is built on top of [TanStack Table](https://tanstack.com/table/latest/docs/guide/tables) for efficient data management.

| **Prop**                                                                                | **Type**    | **Default** |
| --------------------------------------------------------------------------------------- | ----------- | ----------- |
| `children` Child components to be rendered within the table. | ~ReactNode~ |        |

### ColumnMeta Interface

This interface is used to define custom metadata for columns in the data grid. It is built on top of [ColumnMeta](https://tanstack.com/table/latest/docs/api/core/column-def#meta).

| **Prop**                                                                                    | **Type**                    | **Default** |
| ------------------------------------------------------------------------------------------- | --------------------------- | ----------- |
| `headerTitle` Custom title for the column header.                | ~string~                    |        |
| `headerClassName` Additional class names for the column header.  | ~string~                    |        |
| `cellClassName` Additional class names for the column cells.     | ~string~                    |        |
| `skeleton` Skeleton component to display while loading data.     | ~ReactNode~                 |        |
| `expandedContent` Function to render expanded content for a row. | ~(row: TData) => ReactNode~ |        |

## Credits

- Built with [TanStack Table](https://tanstack.com/table/latest/docs/guide/tables).
- Built with [DndKit](https://dndkit.com/).