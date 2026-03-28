// Description: Promise toast with loading state
// Order: 7

import { toast } from "sonner"

import { Button } from "@/registry/bases/base/ui/button"

export default function Pattern() {
  const handleDeploy = () => {
    toast.promise(
      new Promise<{ name: string }>((resolve) =>
        setTimeout(() => resolve({ name: "production" }), 2000)
      ),
      {
        loading: "Deploying to production...",
        success: (data) => `Deployed to ${data.name} successfully`,
        error: "Deployment failed. Please try again.",
      }
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={handleDeploy} variant="outline" className="w-fit">
        Deploy
      </Button>
    </div>
  )
}
