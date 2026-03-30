// Description: Empty state with search input
// Order: 3

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/bases/base/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { Kbd } from "@/registry/bases/base/ui/kbd"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>404 — Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder="Try searching for pages…" />
            <InputGroupAddon>
              <IconPlaceholder
                lucide="CircleDashedIcon"
                tabler="IconCircleDashed"
                hugeicons="DashedLineCircleIcon"
                phosphor="CircleDashedIcon"
                remixicon="RiLoaderLine"
              />
            </InputGroupAddon>
            <InputGroupAddon align="inline-end">
              <Kbd>/</Kbd>
            </InputGroupAddon>
          </InputGroup>
          <EmptyDescription>
            Need help? <a href="#">Contact support</a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  )
}
