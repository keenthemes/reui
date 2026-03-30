// Description: Urgent billing notice
// Order: 16

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
      <Frame>
        <FramePanel className="overflow-hidden p-0!">
          <Alert
            variant="destructive"
            className="bg-destructive/5 border-0 shadow-none"
          >
            <IconPlaceholder
              lucide="CreditCardIcon"
              tabler="IconCreditCard"
              hugeicons="CreditCardIcon"
              phosphor="CreditCardIcon"
              remixicon="RiBankCardLine"
            />
            <AlertTitle>Subscription Expiring</AlertTitle>
            <AlertAction>
              <Button size="xs" variant="destructive">
                Renew Now
              </Button>
            </AlertAction>
            <AlertDescription>
              Your annual subscription will expire in 3 days. Renew now to avoid
              service interruption and data loss.
            </AlertDescription>
          </Alert>
        </FramePanel>
      </Frame>
    </div>
  )
}
