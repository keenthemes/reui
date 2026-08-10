import { IconTile } from "@/registry-reui/bases/base/reui/icon-tile"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// The `elevated` variant keeps its background-colored ring and shadow while the
// fill is overridden with a raw Tailwind color plus a white glyph, for solid
// brand-colored tiles.
const tiles = [
  {
    className: "bg-indigo-500 text-white",
    icon: (
      <IconPlaceholder
        lucide="StarIcon"
        tabler="IconStar"
        hugeicons="StarIcon"
        phosphor="StarIcon"
        remixicon="RiStarLine"
      />
    ),
  },
  {
    className: "bg-amber-500 text-white",
    icon: (
      <IconPlaceholder
        lucide="MessageSquareIcon"
        tabler="IconMessageDots"
        hugeicons="Message02Icon"
        phosphor="ChatIcon"
        remixicon="RiChat4Line"
      />
    ),
  },
  {
    className: "bg-emerald-600 text-white",
    icon: (
      <IconPlaceholder
        lucide="Settings2Icon"
        tabler="IconAdjustmentsHorizontal"
        hugeicons="SlidersHorizontalIcon"
        phosphor="SlidersHorizontalIcon"
        remixicon="RiEqualizer2Line"
      />
    ),
  },
  {
    className: "bg-rose-500 text-white",
    icon: (
      <IconPlaceholder
        lucide="CircleAlertIcon"
        tabler="IconAlertCircle"
        hugeicons="AlertCircleIcon"
        phosphor="WarningCircleIcon"
        remixicon="RiErrorWarningLine"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {tiles.map((tile) => (
        <IconTile
          key={tile.className}
          variant="elevated"
          className={tile.className}
          aria-hidden="true"
        >
          {tile.icon}
        </IconTile>
      ))}
    </div>
  )
}
