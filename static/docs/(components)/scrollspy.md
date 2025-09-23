## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i radix-ui
```

Copy and paste the following code into your project's `components/ui/scrollspy.tsx` file.

## Examples

### Horizontal

## API Reference

This component provides a scrollspy navigation system that highlights the current section in view and keeps the URL hash in sync.

### Scrollspy Props

| **Prop**                                                                            | **Type**               | **Default**   |
| ----------------------------------------------------------------------------------- | ---------------------- | ------------- |
| `children` The navigation structure and anchor elements.                            | ~ReactNode~            |               |
| `targetRef` The scrollable container to observe. Defaults to `document`.            | ~RefObject\~           |               |
| `onUpdate` Callback fired when the active section changes. Receives the section id. | ~(id: string) => void~ |               |
| `offset` Offset in pixels to account for sticky headers or spacing above sections.  | ~number~               | ~0~           |
| `smooth` If true, smooth scrolls to the section when a nav item is clicked.         | ~boolean~              | ~true~        |
| `className` Additional class names for the root div.                                | ~string~               |               |
| `dataAttribute` The data attribute prefix used for anchors and sections.            | ~string~               | ~'scrollspy'~ |
| `history` If true, updates the URL hash as the user scrolls or clicks nav items.    | ~boolean~              | ~true~        |

### Data Attributes

| **Data Attribute**      | **Usage**                         | **Description**                                                                  |
| ----------------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| `data-slot="scrollspy"` | On the root wrapper               | Identifies the main Scrollspy container.                                         |
| `data-scrollspy-anchor` | On nav anchor elements            | The section id this anchor targets. Example: ~data-scrollspy-anchor="section-1"~ |
| `data-scrollspy-offset` | On nav anchor elements (optional) | Custom offset for this anchor (overrides global ~offset~ prop).                  |
| `data-scrollspy`        | On the nav group (optional)       | Used for grouping anchors, e.g. for styling or nested scrollspy.                 |
| `data-active`           | On anchor elements                | Applied to the currently active anchor.                                          |
