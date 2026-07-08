import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  return (
    <Button render={<a href="/" />} nativeButton={false}>
      Back to Home
    </Button>
  )
}
