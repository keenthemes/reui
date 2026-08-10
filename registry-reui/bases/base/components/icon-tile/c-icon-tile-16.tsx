import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// The `solid` variant is a filled tone with a contrasting glyph. Override the
// fill with a `bg-*` class plus a readable text color. An empty class keeps the
// primary default.
const tones = [
  "",
  "bg-info text-white",
  "bg-success text-white",
  "bg-warning text-white",
  "bg-destructive text-white",
]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {tones.map((tone) => (
        <IconTile
          key={tone || "primary"}
          variant="solid"
          className={tone}
          aria-hidden="true"
        >
          <IconPlaceholder
            lucide="CircleCheckIcon"
            tabler="IconCircleCheck"
            hugeicons="CheckmarkCircle01Icon"
            phosphor="CheckCircleIcon"
            remixicon="RiCheckboxCircleLine"
          />
        </IconTile>
      ))}
    </div>
  )
}
