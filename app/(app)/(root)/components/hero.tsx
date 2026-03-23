import Link from "next/link"
import { ArrowRightIcon, ChevronRight } from "lucide-react"

import { getPatternsTotalCount } from "@/lib/registry"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Icons } from "@/components/icons"

export default function Hero() {
  const totalCount = getPatternsTotalCount()

  const brands = [
    {
      title: "shadcn/ui",
      logo: Icons.shadcn,
      tooltip: "",
    },
    {
      title: "Base UI",
      logo: Icons.base,
      tooltip: "",
      className: "h-full w-full ms-1",
    },

    {
      title: "Radix UI",
      logo: Icons.radix,
      tooltip: "",
      className: "h-full w-full ms-1",
    },
    {
      title: "Tailwind 4",
      logo: Icons.tailwind,
      tooltip: "",
    },
    {
      title: "React 19",
      logo: Icons.react,
      tooltip: "",
    },
  ]

  return (
    <div className="container-wrapper">
      <div className="flex items-center justify-center py-6 lg:h-[500px]">
        <div className="flex flex-col items-center justify-between gap-6">
          <Link
            href="/docs/changelog"
            className="group/new flex flex-col items-center justify-center gap-2.5 md:flex-row"
          >
            <Badge className="rounded-[16px] border border-blue-50 bg-blue-50 px-2 py-1 text-blue-600 dark:border-blue-950 dark:bg-blue-950 dark:text-blue-50">
              2.0 Release
            </Badge>
            <span className="inline-flex max-w-[200px] items-center gap-1.5 text-center md:max-w-none">
              <span className="text-site-foreground text-sm">
                10x your productivity with <strong>shadcn/ui</strong>
              </span>
              <ArrowRightIcon className="text-site-foreground hidden size-3.5 transition-transform duration-200 group-hover/new:translate-x-0.5 md:inline-block" />
            </span>
          </Link>

          <h1 className="text-center text-3xl font-bold lg:text-5xl">
            Shadcn UI Patterns
          </h1>

          <div className="text-l max-w-lg text-center">
            Go beyond AI defaults and streamline high-end shadcn projects faster
            with the largest free open-source collection of{" "}
            <strong>shadcn/ui</strong> patterns and components for React and
            Tailwind CSS.
          </div>

          <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:gap-3.5">
            <Button
              asChild
              className="site-rounded-lg gap-1.5 px-5 text-nowrap"
            >
              <Link href="/docs/get-started">
                Get Started
                <ChevronRight />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="site-rounded-lg gap-1.5 px-5 text-nowrap"
            >
              <Link href="/patterns">Explore 1000+ Patterns</Link>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6">
            {brands.map((brand, index) => (
              <div key={index} className="flex flex-col items-center">
                <Tooltip>
                  <TooltipTrigger className="size-5">
                    {brand.logo({
                      className:
                        "" +
                        (brand.className
                          ? ` ${brand.className}`
                          : "w-full h-full"),
                    })}
                  </TooltipTrigger>
                  <TooltipContent>{brand.title}</TooltipContent>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
