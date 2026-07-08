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
    <Carousel
      opts={{
        align: "center",
        loop: true,
      }}
      className="w-full max-w-xs"
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index} className="basis-[70%]">
            <div className="p-1">
              <Card className="relative aspect-video overflow-hidden border-0 p-0">
                <img
                  src={`https://picsum.photos/800/450?grayscale&random=${index + 30}`}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={450}
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
