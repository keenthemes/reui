import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-3">
      <IconTile
        aria-hidden="true"
        className="border-primary/10 bg-primary/10 text-primary dark:border-primary/25 dark:bg-primary/15"
      >
        <IconPlaceholder
          lucide="StarIcon"
          tabler="IconStar"
          hugeicons="StarIcon"
          phosphor="StarIcon"
          remixicon="RiStarLine"
        />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-success/15 bg-success/10 text-success-foreground dark:border-success/25 dark:bg-success/15 dark:text-success"
      >
        <IconPlaceholder
          lucide="CircleCheckIcon"
          tabler="IconCircleCheck"
          hugeicons="CheckmarkCircle01Icon"
          phosphor="CheckCircleIcon"
          remixicon="RiCheckboxCircleLine"
        />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-warning/15 bg-warning/10 text-warning-foreground dark:border-warning/25 dark:bg-warning/15 dark:text-warning"
      >
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="ClockIcon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
        />
      </IconTile>
      <IconTile
        aria-hidden="true"
        className="border-destructive/15 bg-destructive/10 text-destructive-foreground dark:border-destructive/25 dark:bg-destructive/15 dark:text-destructive"
      >
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconAlertCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        />
      </IconTile>
    </div>
  )
}
