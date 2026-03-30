import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

import { getTotalComponentCount } from "@/lib/registry"
import { Button } from "@/components/ui/button"
import { SectionBackdrop } from "@/components/custom/section-backdrop"
import { Icons } from "@/components/icons"

const SHADCN_AVATAR = "https://github.com/shadcn.png"

export default function Hero() {
  const totalCount = getTotalComponentCount()

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
    <section
      className="container-wrapper relative overflow-hidden py-16 lg:py-24"
      aria-labelledby="hero-heading"
    >
      <SectionBackdrop />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <div className="bg-site-background border-site-border flex items-center justify-center rounded-full border shadow-xs shadow-black/5">
          <Link
            href="/docs/changelog"
            className="group bg-site-muted/40 hover:bg-site-muted/60 flex items-center gap-2 rounded-full py-1 pr-1 pl-2 text-xs transition-colors duration-200 sm:text-sm"
          >
            <strong className="inline sm:hidden">v2.0:</strong>
            <strong className="hidden sm:inline">v2.0 Release:</strong>
            <span className="text-site-foreground font-medium">
              10x your productivity with <strong>shadcn/ui</strong>
            </span>
            <span className="bg-site-background group-hover:bg-site-background flex size-6 shrink-0 items-center justify-center rounded-full shadow-sm transition-colors duration-200">
              <ArrowRight
                className="text-site-foreground size-3.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        </div>

        <h1
          id="hero-heading"
          className="text-site-foreground inline-flex max-w-4xl flex-wrap items-center justify-center gap-2 text-2xl leading-[1.1] font-semibold tracking-tight text-balance lg:text-5xl"
        >
          <span>Supercharge your </span>
          <span className="inline-flex items-center gap-1">
            <Image
              src={SHADCN_AVATAR}
              alt=""
              width={36}
              height={36}
              unoptimized
              aria-hidden="true"
              className="site-rounded-full mt-0.5 ml-1 size-6 shrink-0 sm:size-9"
            />
            <span className="flex items-center">shadcn/ui</span>
          </span>
          <span> projects & ship faster</span>
        </h1>

        <p className="text-site-foreground/90 max-w-xl text-base leading-relaxed text-pretty sm:text-lg">
          Go beyond AI defaults and build interfaces faster that stand out with
          the largest free and open-source collection of shadcn/ui components
          for React and Tailwind CSS
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="site-rounded-lg min-w-36 gap-1.5">
            <Link href="/docs/get-started">
              Get started
              <ChevronRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="site-rounded-lg min-w-36"
          >
            <Link href="/components">Explore {totalCount}+ components</Link>
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-2">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex flex-col items-center"
              title={brand.title}
            >
              <div className="size-5" aria-label={brand.title}>
                {brand.logo({
                  className:
                    "" +
                    (brand.className ? ` ${brand.className}` : "h-full w-full"),
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
