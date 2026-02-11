// Description: Card with image
// Order: 7

import Image from "next/image"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs">
      <CardContent className="flex flex-col gap-4">
        <div className="style-vega:rounded-lg style-nova:rounded-lg style-lyra:rounded-none style-maia:rounded-2xl style-mira:rounded-md relative h-48 w-full overflow-hidden">
          <Image
            src="https://picsum.photos/1000/800?grayscale&random=18"
            alt="16:9"
            fill
            className="object-cover"
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
