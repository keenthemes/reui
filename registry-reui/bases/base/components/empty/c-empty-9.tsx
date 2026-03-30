// Description: No notifications empty state
// Order: 9

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="bg-muted py-16">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPlaceholder
              lucide="BellOffIcon"
              tabler="IconBellOff"
              hugeicons="NotificationOff03Icon"
              phosphor="BellSlashIcon"
              remixicon="RiNotificationOffLine"
            />
          </EmptyMedia>
          <EmptyTitle>No notifications</EmptyTitle>
          <EmptyDescription>
            When you get notifications, they&apos;ll show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
