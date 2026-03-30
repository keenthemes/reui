// Description: Avatar inside an empty state example
// Order: 28

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <AvatarGroup>
        <Avatar>
          <AvatarImage
            src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
            alt="sarah@example.com"
            className="grayscale"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/maxleiter.png"
            alt="@maxleiter"
            className="grayscale"
          />
          <AvatarFallback>LR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://github.com/evilrabbit.png"
            alt="@evilrabbit"
            className="grayscale"
          />
          <AvatarFallback>ER</AvatarFallback>
        </Avatar>
        <AvatarGroupCount aria-label="Add collaborator">
          <IconPlaceholder
            lucide="UserPlusIcon"
            tabler="IconUserPlus"
            hugeicons="UserAdd01Icon"
            phosphor="UserPlusIcon"
            remixicon="RiUserAddLine"
            aria-hidden="true"
          />
        </AvatarGroupCount>
      </AvatarGroup>
      <div className="space-y-0.5">
        <h3 className="text-sm font-medium">No active collaborators</h3>
        <p className="text-muted-foreground text-xs">
          Invite teammates to start working together.
        </p>
      </div>
    </div>
  )
}
