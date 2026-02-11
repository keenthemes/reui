// Description: Toast with status alert markup
// Order: 11

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const showStatusToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-3xl style-mira:rounded-md flex w-[356px] flex-col gap-2 border p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium">Deployment Successful</p>
        </div>
        <div className="text-muted-foreground space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span>Environment</span>
            <span className="text-foreground font-medium">Production</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Duration</span>
            <span className="text-foreground font-medium">42s</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Commit</span>
            <span className="text-foreground font-mono font-medium">
              a1b2c3d
            </span>
          </div>
        </div>
        <div className="mt-1 flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="flex-1"
            onClick={() => toast.dismiss()}
          >
            <IconPlaceholder
              lucide="ExternalLinkIcon"
              tabler="IconExternalLink"
              hugeicons="LinkSquare01Icon"
              phosphor="ArrowSquareOutIcon"
              remixicon="RiExternalLinkLine"
              className="size-3"
              aria-hidden="true"
            />
            View Logs
          </Button>
          <Button size="xs" className="flex-1" onClick={() => toast.dismiss()}>
            Open Site
          </Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showStatusToast} variant="outline" className="w-fit">
        Deployment Toast
      </Button>
    </div>
  )
}
