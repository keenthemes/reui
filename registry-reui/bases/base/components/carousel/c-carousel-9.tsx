"use client"

import { useCallback, useEffect, useState } from "react"

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
    <div className="flex w-full max-w-md flex-col gap-3 p-4">
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {Array.from({ length: ITEMS_COUNT }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="bg-muted relative aspect-video overflow-hidden rounded-xl">
                <img
                  src={`https://picsum.photos/1000/800?grayscale&random=${index + 20}`}
                  alt={`Slide ${index + 1}`}
                  width={1000}
                  height={800}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
              className="basis-1/5 cursor-pointer pl-2 sm:basis-1/6"
              onClick={() => onThumbClick(index)}
            >
              <div
                className={cn(
                  "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                  index === selectedIndex
                    ? "border-primary opacity-100"
                    : "border-transparent opacity-40 hover:opacity-70"
                )}
              >
                <img
                  src={`https://picsum.photos/400/400?grayscale&random=${index + 20}`}
                  alt={`Thumb ${index + 1}`}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
