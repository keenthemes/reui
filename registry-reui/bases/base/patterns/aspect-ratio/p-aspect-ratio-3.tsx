// Description: 1:1 square aspect ratio
// Order: 3

import Image from "next/image"

import { AspectRatio } from "@/registry/bases/base/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-xs">
      <AspectRatio
        ratio={1 / 1}
        className="bg-muted style-vega:rounded-xl style-nova:rounded-xl style-lyra:rounded-none style-maia:rounded-4xl style-mira:rounded-md overflow-hidden border"
      >
        <Image
          src="https://picsum.photos/1000/800?grayscale&random=3"
          alt="1:1"
          fill
          className="object-cover"
        />
      </AspectRatio>
    </div>
  )
}
