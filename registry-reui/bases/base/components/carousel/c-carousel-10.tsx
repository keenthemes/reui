// Description: Carousel with overlay thumbnail navigation
// Order: 10

"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/registry/bases/base/ui/carousel"

const ITEMS_COUNT = 10

export default function Pattern() {
  const [mainApi, setMainApi] = useState<CarouselApi>()
  const [thumbApi, setThumbApi] = useState<CarouselApi>()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return
      mainApi.scrollTo(index)
    },
    [mainApi, thumbApi]
  )

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return
    const index = mainApi.selectedScrollSnap()
    setSelectedIndex(index)
    thumbApi.scrollTo(index)
  }, [mainApi, thumbApi])

  useEffect(() => {
    if (!mainApi) return
    onSelect()
    mainApi.on("select", onSelect)
    mainApi.on("reInit", onSelect)
    return () => {
      mainApi.off("select", onSelect)
      mainApi.off("reInit", onSelect)
    }
  }, [mainApi, onSelect])

  return (
    <div className="flex w-full max-w-2xl items-center justify-center p-4">
      <div className="group style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative w-full overflow-hidden">
        {/* Main Carousel */}
        <Carousel setApi={setMainApi} className="w-full">
          <CarouselContent>
            {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
              <CarouselItem key={index}>
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  <Image
                    src={`https://picsum.photos/1200/675?grayscale&random=${index + 60}`}
                    alt={`Slide ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Overlay Thumbnails Container */}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4 transition-opacity duration-300">
          <div className="relative mx-auto w-full max-w-md">
            <Carousel
              setApi={setThumbApi}
              opts={{
                containScroll: "keepSnaps",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 flex-row">
                {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/4 cursor-pointer pl-2 sm:basis-1/8"
                    onClick={() => onThumbClick(index)}
                  >
                    <div
                      className={cn(
                        "style-vega:rounded-md style-nova:rounded-md style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md relative aspect-square overflow-hidden border-2 transition-all duration-300",
                        index === selectedIndex
                          ? "border-white opacity-100 ring-2 ring-black/20"
                          : "border-white/40 opacity-50 hover:opacity-80"
                      )}
                    >
                      <Image
                        src={`https://picsum.photos/200/200?grayscale&random=${index + 60}`}
                        alt={`Thumb ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  )
}
