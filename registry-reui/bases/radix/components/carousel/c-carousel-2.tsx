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
    <div className="flex w-full items-center justify-center p-6">
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[325px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="basis-1/2 pt-1">
              <div className="p-1">
                <Card className="relative h-[145px] overflow-hidden border-0 p-0">
                  <img
                    src={`https://picsum.photos/600/300?grayscale&random=${index + 10}`}
                    alt={`Slide ${index + 1}`}
                    width={600}
                    height={300}
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
    </div>
  )
}
