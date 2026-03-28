// Description: Button with an icon on the left
// Order: 14

import { Button } from "@/registry/bases/radix/ui/button"
import { IconPlaceholder } from "@/app/(create)/customizer/icon-placeholder"

export default function Pattern() {
  return (
    <Button>
      <IconPlaceholder
        lucide="CloudDownloadIcon"
        tabler="IconCloudDownload"
        hugeicons="CloudDownloadIcon"
        phosphor="CloudArrowDownIcon"
        remixicon="RiDownloadCloud2Line"
        aria-hidden="true"
      />
      Download
    </Button>
  )
}
