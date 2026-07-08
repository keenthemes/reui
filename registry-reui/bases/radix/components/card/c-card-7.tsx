import { Badge } from "@/registry-reui/bases/radix/reui/badge"

import { Button } from "@/registry/bases/radix/ui/button"
import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <div className="relative h-48 w-full overflow-hidden rounded-lg">
          <img
            src="https://picsum.photos/1000/800?grayscale&random=18"
            alt="16:9"
            width={1000}
            height={800}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-between gap-5">
          <Badge variant="outline">
            <IconPlaceholder
              lucide="BellIcon"
              tabler="IconBell"
              hugeicons="NotificationIcon"
              phosphor="BellIcon"
              remixicon="RiNotificationLine"
              aria-hidden="true"
            />
            Trending
          </Badge>
          <div className="flex items-center gap-1">
            <IconPlaceholder
              lucide="SparklesIcon"
              tabler="IconSparkles"
              hugeicons="SparklesIcon"
              phosphor="SparkleIcon"
              remixicon="RiSparklingLine"
              aria-hidden="true"
            />
            <span className="text-secondary-foreground text-xs font-medium">
              Featured
            </span>
          </div>
        </div>

        <p className="text-foreground text-sm">
          Simplifying your workflow from day one. Manage your tasks, projects,
          and team in one place.
        </p>

        <Button>
          Get Started
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight02Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
            aria-hidden="true"
          />
        </Button>
      </CardContent>
    </Card>
  )
}
