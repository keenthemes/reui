import { IconTile } from "@/registry-reui/bases/radix/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// The `soft` variant derives every fill and border from currentColor, so one
// text color class retints the whole tile. An empty class keeps the primary
// default. The tones pair a readable light-mode foreground with the brighter
// dark-mode token, matching the ReUI badge light variants.
const tones = [
  "",
  "text-info-foreground dark:text-info",
  "text-success-foreground dark:text-success",
  "text-warning-foreground dark:text-warning",
  "text-destructive-foreground dark:text-destructive",
]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {tones.map((tone) => (
        <IconTile
          key={tone || "primary"}
          variant="soft"
          className={tone}
          aria-hidden="true"
        >
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
          />
        </IconTile>
      ))}
    </div>
  )
}
