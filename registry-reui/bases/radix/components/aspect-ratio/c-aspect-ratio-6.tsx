import { AspectRatio } from "@/registry/bases/radix/ui/aspect-ratio"

export default function Pattern() {
  return (
    <div className="w-full max-w-md">
      <AspectRatio
        ratio={3 / 2}
        className="bg-muted rounded-xl overflow-hidden border"
      >
        <img
          src="https://picsum.photos/1000/800?grayscale&random=6"
          alt="3:2"
          width={1000}
          height={800}
          className="h-full w-full object-cover"
        />
      </AspectRatio>
    </div>
  )
}
