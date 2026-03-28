// Description: Avatar with light background color fallback
// Order: 14

import { Avatar, AvatarFallback } from "@/registry/bases/base/ui/avatar"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="after:border-primary/10">
        <AvatarFallback className="bg-primary/10 text-primary">
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar className="after:border-destructive/10">
        <AvatarFallback className="bg-destructive/10 text-destructive">
          DV
        </AvatarFallback>
      </Avatar>
      <Avatar className="after:border-green-200 dark:after:border-green-600">
        <AvatarFallback className="bg-green-50 text-green-600 dark:bg-green-900">
          SB
        </AvatarFallback>
      </Avatar>
      <Avatar className="after:border-fuchsia-200 dark:after:border-fuchsia-600">
        <AvatarFallback className="bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-900">
          DB
        </AvatarFallback>
      </Avatar>
    </div>
  )
}
