import { IconStack } from "@/registry-reui/bases/radix/reui/icon-stack"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const stacks = [
  {
    label: "Neutral",
    className: "text-foreground",
    iconClassName: "text-muted-foreground",
  },
  {
    label: "Primary",
    className: "text-primary",
    iconClassName: "text-primary",
  },
  {
    label: "Success",
    className: "text-success",
    iconClassName: "text-success",
  },
  {
    label: "Warning",
    className: "text-warning",
    iconClassName: "text-warning",
  },
]

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-7">
      {stacks.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <IconStack aria-hidden="true" className={item.className}>
            <IconPlaceholder
              lucide="SparklesIcon"
              tabler="IconSparkles"
              hugeicons="SparklesIcon"
              phosphor="SparkleIcon"
              remixicon="RiSparklingLine"
              className={`size-4 ${item.iconClassName}`}
            />
          </IconStack>
          <span className="text-muted-foreground text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
