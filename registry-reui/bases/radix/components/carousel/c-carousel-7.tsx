import { Card } from "@/registry/bases/radix/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/registry/bases/radix/ui/carousel"

export default function Pattern() {
  return (
    <Carousel className="w-full max-w-xs">
      <CarouselContent className="-ml-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2 pl-1">
            <div className="p-1">
              <Card className="relative aspect-square overflow-hidden border-0 p-0">
                <img
                  src={`https://picsum.photos/600/600?grayscale&random=${index + 35}`}
                  alt={`Slide ${index + 1}`}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                />
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
