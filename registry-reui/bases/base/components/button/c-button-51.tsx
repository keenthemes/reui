// Description: Expanding button from icon to label
// Order: 51

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Button className="group/fab relative flex h-10 w-10 items-center overflow-hidden rounded-full px-3 transition-[width] duration-300 ease-in-out hover:w-32">
      <IconPlaceholder
        lucide="PlusIcon"
        tabler="IconPlus"
        hugeicons="PlusSignIcon"
        phosphor="PlusIcon"
        remixicon="RiAddLine"
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover/fab:left-3 group-hover/fab:translate-x-0"
      />

      <span className="ml-8 pr-2 whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover/fab:opacity-100">
        Create New
      </span>
    </Button>
  )
}
