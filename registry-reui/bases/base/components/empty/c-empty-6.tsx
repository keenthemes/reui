// Description: Dashed upload empty state
// Order: 6

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="w-full max-w-md border border-dashed py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPlaceholder
              lucide="CloudUploadIcon"
              tabler="IconCloudUpload"
              hugeicons="CloudUploadIcon"
              phosphor="CloudArrowUpIcon"
              remixicon="RiUploadCloud2Line"
            />
          </EmptyMedia>
          <EmptyTitle>Upload files</EmptyTitle>
          <EmptyDescription>
            Drag and drop files here, or click to browse.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            Browse Files
          </Button>
          <EmptyDescription className="text-xs">
            PNG, JPG, SVG up to 10MB
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}
