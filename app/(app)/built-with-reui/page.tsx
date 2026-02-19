"use client"

import React from "react"
import Link from "next/link"
import { ChevronRight, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SiteHeroTemplates } from "@/components/site-hero-templates"

import { templates } from "./templates-data"

const STACK_LABELS: Record<string, string> = {
  react: "React",
  nextjs: "Next.js",
  tailwind: "Tailwind CSS",
  motion: "Motion",
  reui: "ReUI",
  shadcn: "shadcn/ui",
  radix: "Radix UI",
  supabase: "Supabase",
  prisma: "Prisma",
}

export default function Page() {
  return (
    <div className="container">
      <SiteHeroTemplates />

      <div>
        {templates.map((template) => (
          <div
            key={template.title}
            className="border-border/60 flex flex-col gap-6 border-t py-15 lg:flex-row lg:items-center xl:gap-12 2xl:gap-20"
          >
            {/* Left: Info */}
            <div className="order-2 w-full shrink-0 space-y-6 md:w-[500px] lg:order-1">
              <div className="flex items-center gap-3.5">
                <h2 className="m-0 text-2xl font-bold">{template.title}</h2>
                {template.new && <Badge variant="default">New</Badge>}
                {template.price && <Badge variant="secondary">Premium</Badge>}
                {template.free && <Badge variant="outline">Free</Badge>}
              </div>

              <div className="text-muted-foreground text-base">
                {template.description}
              </div>

              <div className="flex items-center gap-3.5">
                <Button asChild variant="default" size="lg">
                  <Link
                    href={template.purchaseUrl || template.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Purchase on {template.market} - {template.price}
                    <ChevronRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link
                    href={template.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Preview
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
              </div>

              {template.stack && template.stack.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  {template.stack.map((stackKey, i) => (
                    <Badge key={i} variant="outline">
                      {STACK_LABELS[stackKey as string] ?? stackKey}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Image */}
            <div className="order-1 flex w-full grow items-center justify-center overflow-hidden rounded-xl border shadow-md lg:order-2">
              <Link href={template.previewUrl} target="_blank">
                <img
                  src={"/templates/" + template.thumbnail}
                  alt={template.title}
                  className="w-full object-cover lg:-mb-[100px]"
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
