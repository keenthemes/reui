"use client"

import { useRef } from "react"
import { Scrollspy } from "@/registry-reui/bases/radix/reui/scrollspy"

import { Button } from "@/registry/bases/radix/ui/button"
import { ScrollArea } from "@/registry/bases/radix/ui/scroll-area"

export default function Pattern() {
  const parentRef = useRef<HTMLDivElement>(null)
  const nav = [
    {
      id: "section-6",
      label: "Section 1",
    },
    {
      id: "section-7",
      label: "Section 2",
    },
    {
      id: "section-8",
      label: "Section 3",
    },
    {
      id: "section-9",
      label: "Section 4",
    },
    {
      id: "section-10",
      label: "Section 5",
    },
  ]

  return (
    <div className="w-full space-y-5">
      <div className="flex w-full gap-2">
        <Scrollspy offset={50} targetRef={parentRef} className="flex gap-2.5">
          {nav.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              data-scrollspy-anchor={item.id}
              className={
                "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
              }
            >
              {item.label}
            </Button>
          ))}
        </Scrollspy>
      </div>
      <div className="w-full" ref={parentRef}>
        <ScrollArea className="h-[400px] grow">
          <div className="space-y-8">
            {nav.map((item) => (
              <div key={item.id} id={item.id} className="space-y-2.5">
                <h3 className="text-foreground text-base">{item.label}</h3>
                <div className="bg-muted rounded-2xl h-[350px]"></div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
