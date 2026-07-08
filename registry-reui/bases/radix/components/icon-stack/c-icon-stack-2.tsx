import { IconStack } from "@/registry-reui/bases/radix/reui/icon-stack"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const sizes = [
  {
    label: "Small",
    className: "h-16 w-14",
    icon: (
      <IconPlaceholder
        lucide="ArchiveIcon"
        tabler="IconArchive"
        hugeicons="Archive01Icon"
        phosphor="ArchiveIcon"
        remixicon="RiArchiveLine"
        className="size-3.5"
      />
    ),
  },
  {
    label: "Default",
    className: "h-20 w-18",
    icon: (
      <IconPlaceholder
        lucide="PackageIcon"
        tabler="IconPackage"
        hugeicons="Package01Icon"
        phosphor="PackageIcon"
        remixicon="RiBox3Line"
        className="size-4"
      />
    ),
  },
  {
    label: "Large",
    className: "h-28 w-24",
    icon: (
      <IconPlaceholder
        lucide="LayersIcon"
        tabler="IconStack2"
        hugeicons="Layers01Icon"
        phosphor="StackIcon"
        remixicon="RiStackLine"
        className="size-6"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {sizes.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <IconStack aria-hidden="true" className={item.className}>
            {item.icon}
          </IconStack>
          <span className="text-muted-foreground text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
