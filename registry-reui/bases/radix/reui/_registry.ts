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
      "class-variance-authority",
      "radix-ui"
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
        "target": "component/reui/data-grid/data-grid-column-filter.tsx"
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
        "target": "component/reui/data-grid/data-grid-column-header.tsx"
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
        "target": "component/reui/data-grid/data-grid-column-visibility.tsx"
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
        "target": "component/reui/data-grid/data-grid-pagination.tsx"
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
        "target": "component/reui/data-grid/data-grid-table-dnd-rows.tsx"
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
        "target": "component/reui/data-grid/data-grid-table-dnd.tsx"
      }
    ]
  },
  {
    "name": "data-grid-table",
    "type": "registry:ui",
    "title": "Data Grid Table",
    "description": "",
    "registryDependencies": [
      "checkbox"
    ],
    "dependencies": [
      "@tanstack/react-table",
      "class-variance-authority"
    ],
    "files": [
      {
        "path": "reui/data-grid/data-grid-table.tsx",
        "type": "registry:ui",
        "target": "component/reui/data-grid/data-grid-table.tsx"
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
      "skeleton"
    ],
    "dependencies": [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "@tanstack/react-table",
      "class-variance-authority"
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
    "name": "data-grid-pagination",
    "type": "registry:ui",
    "title": "Data Grid Pagination",
    "description": "",
    "registryDependencies": [
      "button",
      "data-grid",
      "select",
      "skeleton"
    ],
    "dependencies": [],
    "files": [
      {
        "path": "reui/data-grid-pagination.tsx",
        "type": "registry:ui",
        "target": "components/reui/data-grid-pagination.tsx"
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
    "name": "kanban",
    "type": "registry:ui",
    "title": "Kanban",
    "description": "",
    "registryDependencies": [],
    "dependencies": [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "radix-ui"
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
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "radix-ui"
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
    "dependencies": [],
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
      "radix-ui"
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
      "@headless-tree/core",
      "radix-ui"
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
