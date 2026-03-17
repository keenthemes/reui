// Description: Card with header label and link
// Order: 18

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const item = {
  label: "Documentation",
  description:
    "Find guides, API references, and examples to integrate with our platform.",
  link: "View docs",
  icon: (
    <IconPlaceholder
      lucide="BookOpenIcon"
      tabler="IconBook"
      hugeicons="BookOpen01Icon"
      phosphor="BookOpenIcon"
      remixicon="RiBookOpenLine"
      aria-hidden="true"
    />
  ),
}

export default function Pattern() {
  return (
    <Card className="w-full max-w-xs p-0">
      <CardContent className="p-0">
        <div className="border-b px-4 py-3">
          <div className="text-muted-foreground flex items-center gap-2 [&_svg]:size-4">
            {item.icon}
            <span className="text-foreground text-sm font-medium">
              {item.label}
            </span>
          </div>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-muted-foreground text-sm leading-relaxed">
            {item.description}
          </p>
          <a
            href="#"
            className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline"
          >
            <IconPlaceholder
              lucide="LinkIcon"
              tabler="IconLink"
              hugeicons="Link01Icon"
              phosphor="LinkIcon"
              remixicon="RiLinkM"
              aria-hidden="true"
              className="size-2.5 shrink-0"
            />
            {item.link}
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
