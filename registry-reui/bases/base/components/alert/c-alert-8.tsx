// Description: Error alert
// Order: 8

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
      <AlertTitle>Error! Something went wrong</AlertTitle>
      <AlertDescription>
        Please try again. If the problem persists, contact support.
      </AlertDescription>
    </Alert>
  )
}
