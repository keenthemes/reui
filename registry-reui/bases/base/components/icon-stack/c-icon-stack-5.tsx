import { IconStack } from "@/registry-reui/bases/base/reui/icon-stack"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center p-4">
      <Empty className="max-w-md py-10">
        <EmptyHeader>
          <EmptyMedia>
            <IconStack aria-hidden="true" className="text-primary h-24 w-22">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconInbox"
                hugeicons="InboxIcon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
                className="text-primary size-5"
              />
            </IconStack>
          </EmptyMedia>
          <EmptyTitle>Workspace is ready</EmptyTitle>
          <EmptyDescription>
            Invite teammates or connect a data source to start filling this
            view.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="flex-row justify-center gap-2">
          <Button size="sm">
            <IconPlaceholder
              lucide="UserPlusIcon"
              tabler="IconUserPlus"
              hugeicons="UserAdd01Icon"
              phosphor="UserPlusIcon"
              remixicon="RiUserAddLine"
              data-icon="inline-start"
            />
            Invite team
          </Button>
          <Button variant="outline" size="sm">
            <IconPlaceholder
              lucide="DatabaseIcon"
              tabler="IconDatabase"
              hugeicons="DatabaseIcon"
              phosphor="DatabaseIcon"
              remixicon="RiDatabase2Line"
              data-icon="inline-start"
            />
            Connect source
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
