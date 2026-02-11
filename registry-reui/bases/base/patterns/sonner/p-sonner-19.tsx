// Description: Toast with custom icon
// Order: 19

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Message sent", {
            description: "Your message has been delivered.",
            icon: (
              <IconPlaceholder
                lucide="SendIcon"
                tabler="IconSend"
                hugeicons="SentIcon"
                phosphor="PaperPlaneTiltIcon"
                remixicon="RiSendInsLine"
                className="size-4"
              />
            ),
          })
        }
      >
        Send Icon
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Download complete", {
            description: "design-assets.zip is ready.",
            icon: (
              <IconPlaceholder
                lucide="DownloadIcon"
                tabler="IconDownload"
                hugeicons="Download01Icon"
                phosphor="DownloadSimpleIcon"
                remixicon="RiDownload2Line"
                className="size-4"
              />
            ),
          })
        }
      >
        Download Icon
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="w-fit"
        onClick={() =>
          toast("Bookmark added", {
            description: "Saved to your collection.",
            icon: (
              <IconPlaceholder
                lucide="BookmarkIcon"
                tabler="IconBookmark"
                hugeicons="Bookmark02Icon"
                phosphor="BookmarkSimpleIcon"
                remixicon="RiBookmarkLine"
                className="size-4"
              />
            ),
          })
        }
      >
        Bookmark Icon
      </Button>
    </div>
  )
}
