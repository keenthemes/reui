// Description: Feature discovery alert
// Order: 18

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/registry-reui/bases/base/reui/alert"
import { Frame, FramePanel } from "@/registry-reui/bases/base/reui/frame"

import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Frame variant="ghost">
        <FramePanel className="overflow-hidden p-0!">
          <Alert variant="info" className="border-0 shadow-none">
            <IconPlaceholder
              lucide="LightbulbIcon"
              tabler="IconBulb"
              hugeicons="Idea01Icon"
              phosphor="LightbulbIcon"
              remixicon="RiLightbulbLine"
            />
            <AlertTitle>New: Advanced Analytics</AlertTitle>
            <AlertAction>
              <Button
                size="xs"
                variant="ghost"
                className="text-muted-foreground hover:text-foreground -mt-1 -mr-2 size-7 p-0 hover:bg-transparent"
              >
                <IconPlaceholder
                  lucide="XIcon"
                  tabler="IconX"
                  hugeicons="MultiplicationSignIcon"
                  phosphor="XIcon"
                  remixicon="RiCloseLine"
                  className="size-3.5"
                />
              </Button>
            </AlertAction>
            <AlertDescription>
              We&apos;ve just released a new dashboard for tracking your
              team&apos;s performance.
              <Button
                variant="link"
                size="sm"
                className="text-info h-auto p-0 underline"
              >
                Explore features
              </Button>
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}
