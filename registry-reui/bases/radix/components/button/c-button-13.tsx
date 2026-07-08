import { Button } from "@/registry/bases/radix/ui/button"
import { Spinner } from "@/registry/bases/radix/ui/spinner"

export default function Pattern() {
  return (
    <Button disabled>
      <Spinner aria-hidden="true" />
      Please wait
    </Button>
  )
}
