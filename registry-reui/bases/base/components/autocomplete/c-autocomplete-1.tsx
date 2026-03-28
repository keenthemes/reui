// Description: Basic autocomplete control
// Order: 1

import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from "@/registry-reui/bases/base/reui/autocomplete"

export default function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <Autocomplete items={items}>
        <AutocompleteInput placeholder="Search items" />
        <AutocompleteContent>
          <AutocompleteEmpty>No items found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.id} value={item.value}>
                {item.value}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  )
}

interface Item {
  id: string
  value: string
}

const items: Item[] = [
  { id: "t1", value: "Feature" },
  { id: "t2", value: "Fix" },
  { id: "t3", value: "Bug" },
  { id: "t4", value: "Docs" },
  { id: "t5", value: "Internal" },
  { id: "t6", value: "Mobile" },
  { id: "c-accordion", value: "component: Accordion" },
  { id: "c-alert-dialog", value: "component: Alert Dialog" },
  { id: "c-autocomplete", value: "component: Autocomplete" },
  { id: "c-avatar", value: "component: Avatar" },
  { id: "c-checkbox", value: "component: Checkbox" },
  { id: "c-checkbox-group", value: "component: Checkbox Group" },
  { id: "c-collapsible", value: "component: Collapsible" },
  { id: "c-combobox", value: "component: Combobox" },
  { id: "c-context-menu", value: "component: Context Menu" },
  { id: "c-dialog", value: "component: Dialog" },
  { id: "c-field", value: "component: Field" },
  { id: "c-fieldset", value: "component: Fieldset" },
  { id: "c-filterable-menu", value: "component: Filterable Menu" },
  { id: "c-form", value: "component: Form" },
  { id: "c-input", value: "component: Input" },
  { id: "c-menu", value: "component: Menu" },
  { id: "c-menubar", value: "component: Menubar" },
  { id: "c-meter", value: "component: Meter" },
  { id: "c-navigation-menu", value: "component: Navigation Menu" },
  { id: "c-number-field", value: "component: Number Field" },
  { id: "c-popover", value: "component: Popover" },
  { id: "c-preview-card", value: "component: Preview Card" },
  { id: "c-progress", value: "component: Progress" },
  { id: "c-radio", value: "component: Radio" },
  { id: "c-scroll-area", value: "component: Scroll Area" },
  { id: "c-select", value: "component: Select" },
  { id: "c-separator", value: "component: Separator" },
  { id: "c-slider", value: "component: Slider" },
  { id: "c-switch", value: "component: Switch" },
  { id: "c-tabs", value: "component: Tabs" },
  { id: "c-toast", value: "component: Toast" },
  { id: "c-toggle", value: "component: Toggle" },
  { id: "c-toggle-group", value: "component: Toggle Group" },
  { id: "c-toolbar", value: "component: Toolbar" },
  { id: "c-tooltip", value: "component: Tooltip" },
]
