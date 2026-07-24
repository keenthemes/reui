import { type Registry } from "shadcn/schema"

export const reui: Registry["items"] = [
  {
    "name": "alert",
    "type": "registry:ui",
    "title": "Alert",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/alert.tsx",
        "type": "registry:ui",
        "target": "components/reui/alert.tsx"
      }
    ],
    "cssVars": {
      "light": {
        "destructive-foreground": "var(--color-red-800)",
        "success": "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-900)",
        "info": "var(--color-violet-500)",
        "info-foreground": "var(--color-violet-900)",
        "warning": "var(--color-yellow-500)",
        "warning-foreground": "var(--color-yellow-900)",
        "invert": "var(--color-zinc-900)",
        "invert-foreground": "var(--color-zinc-50)"
      },
      "dark": {
        "destructive-foreground": "var(--color-red-600)",
        "success": "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-600)",
        "info": "var(--color-violet-500)",
        "info-foreground": "var(--color-violet-600)",
        "warning": "var(--color-yellow-500)",
        "warning-foreground": "var(--color-yellow-600)",
        "invert": "var(--color-zinc-700)",
        "invert-foreground": "var(--color-zinc-50)"
      }
    }
  },
  {
    "name": "autocomplete",
    "type": "registry:ui",
    "title": "Autocomplete",
    "description": "",
    "registryDependencies": [
      "scroll-area"
    ],
    "dependencies": [
      "@base-ui/react",
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/autocomplete.tsx",
        "type": "registry:ui",
        "target": "components/reui/autocomplete.tsx"
      }
    ]
  },
  {
    "name": "badge",
    "type": "registry:ui",
    "title": "Badge",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react",
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/badge.tsx",
        "type": "registry:ui",
        "target": "components/reui/badge.tsx"
      }
    ],
    "cssVars": {
      "light": {
        "destructive-foreground": "var(--color-red-800)",
        "success": "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-900)",
        "info": "var(--color-violet-500)",
        "info-foreground": "var(--color-violet-900)",
        "warning": "var(--color-yellow-500)",
        "warning-foreground": "var(--color-yellow-900)",
        "invert": "var(--color-zinc-900)",
        "invert-foreground": "var(--color-zinc-50)"
      },
      "dark": {
        "destructive-foreground": "var(--color-red-600)",
        "success": "var(--color-emerald-500)",
        "success-foreground": "var(--color-emerald-600)",
        "info": "var(--color-violet-500)",
        "info-foreground": "var(--color-violet-600)",
        "warning": "var(--color-yellow-500)",
        "warning-foreground": "var(--color-yellow-600)",
        "invert": "var(--color-zinc-700)",
        "invert-foreground": "var(--color-zinc-50)"
      }
    }
  },
  {
    "name": "data-grid-column-filter",
    "type": "registry:ui",
    "title": "Data Grid Column Filter",
    "description": "",
    "registryDependencies": [
      "badge",
      "button",
      "input",
      "popover",
      "separator"
    ],
    "dependencies": [
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-column-filter.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-filter.tsx"
      }
    ]
  },
  {
    "name": "data-grid-column-header",
    "type": "registry:ui",
    "title": "Data Grid Column Header",
    "description": "",
    "registryDependencies": [
      "button",
      "dropdown-menu"
    ],
    "dependencies": [
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-column-header.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-header.tsx"
      }
    ]
  },
  {
    "name": "data-grid-column-visibility",
    "type": "registry:ui",
    "title": "Data Grid Column Visibility",
    "description": "",
    "registryDependencies": [
      "dropdown-menu"
    ],
    "dependencies": [
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-column-visibility.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-visibility.tsx"
      }
    ]
  },
  {
    "name": "data-grid-pagination",
    "type": "registry:ui",
    "title": "Data Grid Pagination",
    "description": "",
    "registryDependencies": [
      "button",
      "select",
      "skeleton"
    ],
    "dependencies": [],
    "files": [
      {
        "path": "reui/data-grid/data-grid-pagination.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-pagination.tsx"
      }
    ]
  },
  {
    "name": "data-grid-scroll-area",
    "type": "registry:ui",
    "title": "Data Grid Scroll Area",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-scroll-area.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-scroll-area.tsx"
      }
    ]
  },
  {
    "name": "data-grid-table-dnd-rows",
    "type": "registry:ui",
    "title": "Data Grid Table Dnd Rows",
    "description": "",
    "registryDependencies": [
      "button"
    ],
    "dependencies": [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-table-dnd-rows.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-dnd-rows.tsx"
      }
    ]
  },
  {
    "name": "data-grid-table-dnd",
    "type": "registry:ui",
    "title": "Data Grid Table Dnd",
    "description": "",
    "registryDependencies": [
      "button"
    ],
    "dependencies": [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-table-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-dnd.tsx"
      }
    ]
  },
  {
    "name": "data-grid-table-virtual",
    "type": "registry:ui",
    "title": "Data Grid Table Virtual",
    "description": "",
    "registryDependencies": [
      "spinner"
    ],
    "dependencies": [
      "@tanstack/react-table",
      "@tanstack/react-virtual"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-table-virtual.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-virtual.tsx"
      }
    ]
  },
  {
    "name": "data-grid-table",
    "type": "registry:ui",
    "title": "Data Grid Table",
    "description": "",
    "registryDependencies": [
      "checkbox",
      "spinner"
    ],
    "dependencies": [
      "@tanstack/react-table"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-table.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table.tsx"
      }
    ]
  },
  {
    "name": "data-grid",
    "type": "registry:ui",
    "title": "Data Grid",
    "description": "",
    "registryDependencies": [
      "badge",
      "button",
      "checkbox",
      "dropdown-menu",
      "input",
      "popover",
      "select",
      "separator",
      "skeleton",
      "spinner"
    ],
    "dependencies": [
      "@base-ui/react",
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "@tanstack/react-virtual"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-column-filter.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-filter.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-column-header.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-header.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-column-visibility.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-column-visibility.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-pagination.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-pagination.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-scroll-area.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-scroll-area.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-table-dnd-rows.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-dnd-rows.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-table-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-dnd.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-table-virtual.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table-virtual.tsx"
      },
      {
        "path": "reui/data-grid/data-grid-table.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid-table.tsx"
      },
      {
        "path": "reui/data-grid/data-grid.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid/data-grid.tsx"
      }
    ]
  },
  {
    "name": "date-selector",
    "type": "registry:ui",
    "title": "Date Selector",
    "description": "",
    "registryDependencies": [
      "button",
      "calendar",
      "input",
      "scroll-area",
      "tabs",
      "use-mobile"
    ],
    "dependencies": [
      "date-fns",
      "react-day-picker"
    ],
    "files": [
      {
        "path": "reui/date-selector.tsx",
        "type": "registry:ui",
        "target": "components/reui/date-selector.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-agenda-view",
    "type": "registry:ui",
    "title": "Chronological agenda grouped by day - a day header row plus a clean time / dot / title table.",
    "description": "Chronological agenda grouped by day - a day header row plus a clean time / dot / title table.",
    "registryDependencies": [
      "icon-stack",
      "scroll-area"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-agenda-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-agenda-view.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-content",
    "type": "registry:ui",
    "title": "Active-view switchboard rendering month, week, day, N-days, or agenda; swappable per view via the components prop.",
    "description": "Active-view switchboard rendering month, week, day, N-days, or agenda; swappable per view via the components prop.",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-content.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-content.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-dnd",
    "type": "registry:ui",
    "title": "Custom pointer-event interaction engine - move, resize, and drag-create across month, week, day, and N-day views with live validation.",
    "description": "Custom pointer-event interaction engine - move, resize, and drag-create across month, week, day, and N-day views with live validation.",
    "registryDependencies": [],
    "dependencies": [
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-dnd.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-event",
    "type": "registry:ui",
    "title": "The reusable event chip/bar/block - selection, clicks, drag + resize wiring, and the consumer render slot.",
    "description": "The reusable event chip/bar/block - selection, clicks, drag + resize wiring, and the consumer render slot.",
    "registryDependencies": [
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-event.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-event.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-i18n",
    "type": "registry:ui",
    "title": "Default UI texts, date-format strings, and formatter functions for the event calendar, fully overridable per key.",
    "description": "Default UI texts, date-format strings, and formatter functions for the event calendar, fully overridable per key.",
    "registryDependencies": [],
    "dependencies": [
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-i18n.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-i18n.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-lib",
    "type": "registry:ui",
    "title": "Pure, React-free calendar math: view ranges, zoned day keys, multi-day segmentation, overlap packing, lane packing, and the event index.",
    "description": "Pure, React-free calendar math: view ranges, zoned day keys, multi-day segmentation, overlap packing, lane packing, and the event index.",
    "registryDependencies": [],
    "dependencies": [
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-lib.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-lib.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-month-view",
    "type": "registry:ui",
    "title": "ARIA-grid month view with week rows, day cells, event chips, and overflow counts.",
    "description": "ARIA-grid month view with week rows, day cells, event chips, and overflow counts.",
    "registryDependencies": [
      "popover",
      "scroll-area"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-month-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-month-view.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-nav",
    "type": "registry:ui",
    "title": "Composable navigation - Today, prev/next, period title, view switcher dropdown, and a free toolbar slot.",
    "description": "Composable navigation - Today, prev/next, period title, view switcher dropdown, and a free toolbar slot.",
    "registryDependencies": [
      "button",
      "calendar",
      "dropdown-menu",
      "popover",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-nav.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-nav.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-recurrence",
    "type": "registry:ui",
    "title": "RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.",
    "description": "RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.",
    "registryDependencies": [],
    "dependencies": [
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-recurrence.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-recurrence.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-resource-view",
    "type": "registry:ui",
    "title": "Resource-columns day grid for booking scenarios - one time axis, one column per resource, full drag, resize, and drag-create.",
    "description": "Resource-columns day grid for booking scenarios - one time axis, one column per resource, full drag, resize, and drag-create.",
    "registryDependencies": [
      "scroll-area"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-resource-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-resource-view.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-time-grid",
    "type": "registry:ui",
    "title": "Shared week/day/N-days engine - hour gutter, minute-positioned events, all-day row, drag ghosts, now indicator, and configurable scrolling.",
    "description": "Shared week/day/N-days engine - hour gutter, minute-positioned events, all-day row, drag ghosts, now indicator, and configurable scrolling.",
    "registryDependencies": [
      "scroll-area"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-time-grid.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-time-grid.tsx"
      }
    ]
  },
  {
    "name": "event-calendar-types",
    "type": "registry:ui",
    "title": "Public TypeScript contract for the headless event calendar: events, occurrences, segments, state, and callbacks.",
    "description": "Public TypeScript contract for the headless event calendar: events, occurrences, segments, state, and callbacks.",
    "registryDependencies": [],
    "dependencies": [],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-types.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-types.tsx"
      }
    ]
  },
  {
    "name": "event-calendar",
    "type": "registry:ui",
    "title": "Headless-first event calendar with month, week, day, N-day and agenda views, external CRUD contract, and a subscribable store.",
    "description": "Headless-first event calendar with month, week, day, N-day and agenda views, external CRUD contract, and a subscribable store.",
    "registryDependencies": [
      "button",
      "calendar",
      "dropdown-menu",
      "icon-stack",
      "popover",
      "scroll-area",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/event-calendar/event-calendar-agenda-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-agenda-view.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-content.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-content.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-dnd.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-event.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-event.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-i18n.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-i18n.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-lib.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-lib.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-month-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-month-view.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-nav.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-nav.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-recurrence.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-recurrence.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-resource-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-resource-view.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-time-grid.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-time-grid.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar-types.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar-types.tsx"
      },
      {
        "path": "reui/event-calendar/event-calendar.tsx",
        "type": "registry:ui",
        "target": "components/reui/event-calendar/event-calendar.tsx"
      }
    ]
  },
  {
    "name": "filters",
    "type": "registry:ui",
    "title": "Filters",
    "description": "",
    "registryDependencies": [
      "button",
      "button-group",
      "dropdown-menu",
      "input",
      "input-group",
      "kbd",
      "scroll-area",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/filters.tsx",
        "type": "registry:ui",
        "target": "components/reui/filters.tsx"
      }
    ]
  },
  {
    "name": "frame",
    "type": "registry:ui",
    "title": "Frame",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/frame.tsx",
        "type": "registry:ui",
        "target": "components/reui/frame.tsx"
      }
    ]
  },
  {
    "name": "gantt-bar",
    "type": "registry:ui",
    "title": "The interactive gantt bar - selection, clicks, drag + resize wiring, and the consumer render slot.",
    "description": "The interactive gantt bar - selection, clicks, drag + resize wiring, and the consumer render slot.",
    "registryDependencies": [
      "context-menu",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-bar.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-bar.tsx"
      }
    ]
  },
  {
    "name": "gantt-dnd",
    "type": "registry:ui",
    "title": "Custom pointer-event interaction engine - edge resize and drag-create over the horizontal axis with live validation; bars are never dragged whole.",
    "description": "Custom pointer-event interaction engine - edge resize and drag-create over the horizontal axis with live validation; bars are never dragged whole.",
    "registryDependencies": [],
    "dependencies": [
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-dnd.tsx"
      }
    ]
  },
  {
    "name": "gantt-i18n",
    "type": "registry:ui",
    "title": "Default UI texts, date-format strings, and formatter functions for the gantt, fully overridable per key.",
    "description": "Default UI texts, date-format strings, and formatter functions for the gantt, fully overridable per key.",
    "registryDependencies": [],
    "dependencies": [
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-i18n.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-i18n.tsx"
      }
    ]
  },
  {
    "name": "gantt-lib",
    "type": "registry:ui",
    "title": "Pure, React-free calendar math: view ranges, zoned day keys, multi-day segmentation, overlap packing, lane packing, and the event index.",
    "description": "Pure, React-free calendar math: view ranges, zoned day keys, multi-day segmentation, overlap packing, lane packing, and the event index.",
    "registryDependencies": [],
    "dependencies": [
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-lib.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-lib.tsx"
      }
    ]
  },
  {
    "name": "gantt-nav",
    "type": "registry:ui",
    "title": "Composable navigation - Today, view selector, prev/next, go-to-date, period title, and a free toolbar slot.",
    "description": "Composable navigation - Today, view selector, prev/next, go-to-date, period title, and a free toolbar slot.",
    "registryDependencies": [
      "button",
      "calendar",
      "dropdown-menu",
      "popover",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-nav.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-nav.tsx"
      }
    ]
  },
  {
    "name": "gantt-recurrence",
    "type": "registry:ui",
    "title": "RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.",
    "description": "RFC 5545 subset recurrence expansion for the event calendar - structured rules or raw RRULE strings, with a hard occurrence cap.",
    "registryDependencies": [],
    "dependencies": [
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-recurrence.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-recurrence.tsx"
      }
    ]
  },
  {
    "name": "gantt-types",
    "type": "registry:ui",
    "title": "Public TypeScript contract for the headless gantt: events, occurrences, segments, state, and callbacks.",
    "description": "Public TypeScript contract for the headless gantt: events, occurrences, segments, state, and callbacks.",
    "registryDependencies": [],
    "dependencies": [],
    "files": [
      {
        "path": "reui/gantt/gantt-types.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-types.tsx"
      }
    ]
  },
  {
    "name": "gantt-view",
    "type": "registry:ui",
    "title": "The gantt body - split resizable tree/timeline panes with synced scrolling, multi-column tree, grouped two-row header, day through year scales, zoom, drag-to-pan, lanes, drag and resize.",
    "description": "The gantt body - split resizable tree/timeline panes with synced scrolling, multi-column tree, grouped two-row header, day through year scales, zoom, drag-to-pan, lanes, drag and resize.",
    "registryDependencies": [
      "button",
      "checkbox",
      "context-menu",
      "scroll-area",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-view.tsx"
      }
    ]
  },
  {
    "name": "gantt",
    "type": "registry:ui",
    "title": "Headless-first gantt - horizontal resource timeline with day-to-year scales, external CRUD contract, and a subscribable store.",
    "description": "Headless-first gantt - horizontal resource timeline with day-to-year scales, external CRUD contract, and a subscribable store.",
    "registryDependencies": [
      "button",
      "calendar",
      "checkbox",
      "context-menu",
      "dropdown-menu",
      "popover",
      "scroll-area",
      "tooltip"
    ],
    "dependencies": [
      "@base-ui/react",
      "@date-fns/tz",
      "date-fns"
    ],
    "files": [
      {
        "path": "reui/gantt/gantt-bar.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-bar.tsx"
      },
      {
        "path": "reui/gantt/gantt-dnd.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-dnd.tsx"
      },
      {
        "path": "reui/gantt/gantt-i18n.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-i18n.tsx"
      },
      {
        "path": "reui/gantt/gantt-lib.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-lib.tsx"
      },
      {
        "path": "reui/gantt/gantt-nav.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-nav.tsx"
      },
      {
        "path": "reui/gantt/gantt-recurrence.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-recurrence.tsx"
      },
      {
        "path": "reui/gantt/gantt-types.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-types.tsx"
      },
      {
        "path": "reui/gantt/gantt-view.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt-view.tsx"
      },
      {
        "path": "reui/gantt/gantt.tsx",
        "type": "registry:ui",
        "target": "components/reui/gantt/gantt.tsx"
      }
    ]
  },
  {
    "name": "icon-stack",
    "type": "registry:ui",
    "title": "Layered icon illustration container",
    "description": "Layered icon illustration container",
    "registryDependencies": [],
    "dependencies": [],
    "files": [
      {
        "path": "reui/icon-stack.tsx",
        "type": "registry:ui",
        "target": "components/reui/icon-stack.tsx"
      }
    ]
  },
  {
    "name": "kanban",
    "type": "registry:ui",
    "title": "Kanban",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities"
    ],
    "files": [
      {
        "path": "reui/kanban.tsx",
        "type": "registry:ui",
        "target": "components/reui/kanban.tsx"
      }
    ]
  },
  {
    "name": "number-field",
    "type": "registry:ui",
    "title": "Number Field",
    "description": "",
    "registryDependencies": [
      "label"
    ],
    "dependencies": [
      "@base-ui/react",
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/number-field.tsx",
        "type": "registry:ui",
        "target": "components/reui/number-field.tsx"
      }
    ]
  },
  {
    "name": "phone-input",
    "type": "registry:ui",
    "title": "Phone Input",
    "description": "",
    "registryDependencies": [
      "button",
      "combobox",
      "input",
      "scroll-area"
    ],
    "dependencies": [
      "react-phone-number-input"
    ],
    "files": [
      {
        "path": "reui/phone-input.tsx",
        "type": "registry:ui",
        "target": "components/reui/phone-input.tsx"
      }
    ]
  },
  {
    "name": "rating",
    "type": "registry:ui",
    "title": "Rating",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/rating.tsx",
        "type": "registry:ui",
        "target": "components/reui/rating.tsx"
      }
    ]
  },
  {
    "name": "scrollspy",
    "type": "registry:ui",
    "title": "Scrollspy",
    "description": "",
    "registryDependencies": [],
    "dependencies": [],
    "files": [
      {
        "path": "reui/scrollspy.tsx",
        "type": "registry:ui",
        "target": "components/reui/scrollspy.tsx"
      }
    ]
  },
  {
    "name": "sortable",
    "type": "registry:ui",
    "title": "Sortable",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react",
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities"
    ],
    "files": [
      {
        "path": "reui/sortable.tsx",
        "type": "registry:ui",
        "target": "components/reui/sortable.tsx"
      }
    ]
  },
  {
    "name": "stepper",
    "type": "registry:ui",
    "title": "Stepper",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react"
    ],
    "files": [
      {
        "path": "reui/stepper.tsx",
        "type": "registry:ui",
        "target": "components/reui/stepper.tsx"
      }
    ]
  },
  {
    "name": "timeline",
    "type": "registry:ui",
    "title": "Timeline",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react"
    ],
    "files": [
      {
        "path": "reui/timeline.tsx",
        "type": "registry:ui",
        "target": "components/reui/timeline.tsx"
      }
    ]
  },
  {
    "name": "tree",
    "type": "registry:ui",
    "title": "Tree",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@base-ui/react",
      "@headless-tree/core"
    ],
    "files": [
      {
        "path": "reui/tree.tsx",
        "type": "registry:ui",
        "target": "components/reui/tree.tsx"
      }
    ]
  }
]
