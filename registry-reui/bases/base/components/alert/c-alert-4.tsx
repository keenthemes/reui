// Description: Destructive alert with icon and action buttons
// Order: 4

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry-reui/bases/base/reui/alert"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Alert variant="destructive">
      <IconPlaceholder
        lucide="CircleAlertIcon"
        tabler="IconAlertCircle"
        hugeicons="AlertCircleIcon"
        phosphor="WarningCircleIcon"
        remixicon="RiErrorWarningLine"
      />
      <AlertTitle>Payment Failed</AlertTitle>
      <AlertDescription>
        <p>Please check your payment details:</p>
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-sm">
          <li>Card number and expiry</li>
          <li>Billing address</li>
          <li>Available funds</li>
        </ul>
      </AlertDescription>
    </Alert>
  )
}
