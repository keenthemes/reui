// Description: Carousel with dots navigation and content overlays
// Order: 11

"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Card } from "@/registry/bases/base/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/registry/bases/base/ui/carousel"

export default function Pattern() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  return (
    <Carousel setApi={setApi} className="w-full max-w-xs">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="group/card relative aspect-square overflow-hidden border-0 p-0">
                <Image
                  src={`https://picsum.photos/800/800?grayscale&random=${index + 45}`}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="scale-100 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105"
                />
                {/* Background fade effects */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 top-auto flex flex-col justify-end bg-black/20 p-4">
                  <h3 className="text-xl font-bold text-white">
                    Slide {index + 1}
                  </h3>
                  <p className="text-sm text-white/90">
                    Feature description for slide {index + 1}.
                  </p>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 py-3">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={cn(
              "style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-full h-2 cursor-pointer transition-all duration-500 ease-in-out",
              index === current
                ? "bg-primary w-4 opacity-100"
                : "bg-muted-foreground w-2 opacity-30 hover:opacity-50"
            )}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </Carousel>
  )
}
