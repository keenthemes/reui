// Description: Compact settings table with switches
// Order: 13

import { Separator } from "@/registry/bases/base/ui/separator"
import { Switch } from "@/registry/bases/base/ui/switch"

const settings = [
  {
    id: "auto-save",
    label: "Auto-save",
    description: "Save changes automatically",
    checked: true,
  },
  {
    id: "spell-check",
    label: "Spell check",
    description: "Highlight spelling errors",
    checked: true,
  },
  {
    id: "line-numbers",
    label: "Line numbers",
    description: "Show line numbers in editor",
    checked: false,
  },
]

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <p className="mb-3 text-sm font-medium">Editor Preferences</p>
      <Separator />
      <div className="flex flex-col">
        {settings.map((setting) => (
          <label
            key={setting.id}
            htmlFor={setting.id}
            className="flex cursor-pointer items-center justify-between border-b py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{setting.label}</span>
              <span className="text-muted-foreground text-xs">
                {setting.description}
              </span>
            </div>
            <Switch
              id={setting.id}
              defaultChecked={setting.checked}
              size="sm"
            />
          </label>
        ))}
      </div>
    </div>
  )
}
