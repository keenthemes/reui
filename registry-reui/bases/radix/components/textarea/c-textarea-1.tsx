import { Textarea } from "@/registry/bases/radix/ui/textarea"

export default function Pattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <Textarea placeholder="Type your message here…" className="w-full" />
    </div>
  )
}
