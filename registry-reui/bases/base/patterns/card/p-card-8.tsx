// Description: Card with image scale hover effect
// Order: 8

import Image from "next/image"

import { Card } from "@/registry/bases/base/ui/card"

export default function Pattern() {
  return (
    <Card className="group/card relative h-96 w-full max-w-xs overflow-hidden border-0 p-0">
      <Image
        src="https://picsum.photos/1000/800?grayscale&random=62"
        alt="Background"
        fill
        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
      />

      {/* Background fade effects */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/60 to-transparent transition-opacity duration-500 group-hover/card:from-black/70" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-6">
        <h3 className="text-2xl font-bold text-white">Image Scale Effect</h3>
        <p className="mt-2 text-sm text-white/90">
          This card features a smooth image scaling effect and background
          overlay on hover.
        </p>
      </div>
    </Card>
  )
}
