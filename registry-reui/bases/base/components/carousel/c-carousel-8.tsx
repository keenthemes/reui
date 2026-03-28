// Description: Carousel with images and overlays
// Order: 8

import Image from "next/image"

import { Card } from "@/registry/bases/base/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/bases/base/ui/carousel"

export default function Pattern() {
  return (
    <Carousel className="w-full max-w-md">
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="group/card relative aspect-video overflow-hidden border-0 p-0">
                <Image
                  src={`https://picsum.photos/1000/800?grayscale&random=${index + 10}`}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="scale-100 object-cover transition-transform duration-500 ease-in-out group-hover/card:scale-105"
                />
                {/* Background fade effects */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />

                {/* Content */}
                <div className="relative flex h-full flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">
                    Slide {index + 1}
                  </h3>
                  <p className="text-sm text-white/90">
                    Beautiful landscape description for slide {index + 1}.
                  </p>
                </div>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
