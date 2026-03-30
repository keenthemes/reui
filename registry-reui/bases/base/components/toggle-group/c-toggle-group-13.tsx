// Description: Toggle group for notification channels
// Order: 13

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        multiple
        defaultValue={["email", "push"]}
        variant="outline"
        spacing={1}
      >
        <ToggleGroupItem value="email" aria-label="Email notifications">
          <IconPlaceholder
            lucide="MailIcon"
            tabler="IconMail"
            hugeicons="MailIcon"
            phosphor="EnvelopeIcon"
            remixicon="RiMailLine"
          />
          Email
        </ToggleGroupItem>
        <ToggleGroupItem value="sms" aria-label="SMS notifications">
          <IconPlaceholder
            lucide="PhoneIcon"
            tabler="IconPhone"
            hugeicons="Call02Icon"
            phosphor="PhoneIcon"
            remixicon="RiPhoneLine"
          />
          SMS
        </ToggleGroupItem>
        <ToggleGroupItem value="push" aria-label="Push notifications">
          <IconPlaceholder
            lucide="BellIcon"
            tabler="IconBell"
            hugeicons="NotificationIcon"
            phosphor="BellIcon"
            remixicon="RiNotificationLine"
          />
          Push
        </ToggleGroupItem>
        <ToggleGroupItem value="slack" aria-label="Slack notifications">
          <IconPlaceholder
            lucide="MessageSquareIcon"
            tabler="IconMessageDots"
            hugeicons="Message02Icon"
            phosphor="ChatIcon"
            remixicon="RiChat4Line"
          />
          Slack
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}
