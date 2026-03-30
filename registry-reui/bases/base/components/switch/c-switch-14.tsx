// Description: Switch with descriptions in card grid
// Order: 14

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/registry/bases/base/ui/field"
import { Switch } from "@/registry/bases/base/ui/switch"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const features = [
  {
    id: "feat-analytics",
    title: "Analytics",
    description: "Track page views and user interactions",
    checked: true,
    icon: (
      <IconPlaceholder
        lucide="BarChart3Icon"
        tabler="IconChartBar"
        hugeicons="ChartBarLineIcon"
        phosphor="ChartBarIcon"
        remixicon="RiBarChartBoxLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    id: "feat-logging",
    title: "Error Logging",
    description: "Capture and report runtime errors",
    checked: true,
    icon: (
      <IconPlaceholder
        lucide="BugIcon"
        tabler="IconBug"
        hugeicons="Bug01Icon"
        phosphor="BugIcon"
        remixicon="RiBugLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    id: "feat-cdn",
    title: "CDN Caching",
    description: "Serve static assets from edge network",
    checked: false,
    icon: (
      <IconPlaceholder
        lucide="GlobeIcon"
        tabler="IconWorld"
        hugeicons="Globe02Icon"
        phosphor="GlobeSimpleIcon"
        remixicon="RiGlobalLine"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
  {
    id: "feat-backup",
    title: "Auto Backup",
    description: "Daily snapshots of your database",
    checked: false,
    icon: (
      <IconPlaceholder
        lucide="DatabaseIcon"
        tabler="IconDatabase"
        hugeicons="Database02Icon"
        phosphor="DatabaseIcon"
        remixicon="RiDatabase2Line"
        aria-hidden="true"
        className="size-4"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <FieldGroup className="grid w-full max-w-md grid-cols-2 gap-4">
      {features.map((feature) => (
        <FieldLabel key={feature.id} htmlFor={feature.id} className="p-0!">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="flex items-center gap-2">
                <div className="bg-background border-border flex shrink-0 items-center justify-center rounded-md border p-1.5 shadow-xs shadow-black/5">
                  {feature.icon}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold">{feature.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {feature.description}
                  </span>
                </div>
              </FieldTitle>
            </FieldContent>
            <Switch
              id={feature.id}
              defaultChecked={feature.checked}
              size="sm"
            />
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  )
}
