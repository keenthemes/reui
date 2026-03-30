// Description: No data analytics empty state
// Order: 10

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
      <Empty className="border py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconPlaceholder
              lucide="BarChart3Icon"
              tabler="IconChartBar"
              hugeicons="ChartBarLineIcon"
              phosphor="ChartBarIcon"
              remixicon="RiBarChartBoxLine"
            />
          </EmptyMedia>
          <EmptyTitle>No data yet</EmptyTitle>
          <EmptyDescription>
            Once your project starts receiving traffic, analytics will appear
            here.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex gap-2">
            <Button size="sm">Connect Data Source</Button>
            <Button variant="outline" size="sm">
              View Docs
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
