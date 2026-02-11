// Description: Card with full image
// Order: 9

import Image from "next/image"
import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="flex flex-col gap-5 p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src="https://picsum.photos/1000/800?grayscale&random=52"
            alt="16:9"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col items-center gap-4 p-6 pt-0">
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

          <p className="text-foreground text-center text-sm">
            Making your design process faster and easier. Design tools for your
            team.
          </p>

          <Button className="w-fit">
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
        </div>
      </CardContent>
    </Card>
  )
}
