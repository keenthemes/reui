// Description: Search empty state
// Order: 2

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Empty className="bg-muted">
        <EmptyHeader>
          <EmptyTitle>No results found</EmptyTitle>
          <EmptyDescription>
            No results found for your search. Try adjusting your search terms.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Try again</Button>
          <Button variant="link" asChild className="text-muted-foreground">
            <a href="#">
              Learn more{" "}
              <IconPlaceholder
                lucide="ArrowUpRightIcon"
                tabler="IconArrowUpRight"
                hugeicons="ArrowUpRight01Icon"
                phosphor="ArrowUpRightIcon"
                remixicon="RiArrowRightUpLine"
              />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  )
}
