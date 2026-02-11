// Description: Cookie consent dialog
// Order: 8

import { Button } from "@/registry/bases/base/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/base/ui/dialog"
import { Label } from "@/registry/bases/base/ui/label"
import { Switch } from "@/registry/bases/base/ui/switch"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          Cookie Preferences
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cookie Preferences</DialogTitle>
            <DialogDescription>
              You can enable or disable different categories of cookies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label className="text-sm font-medium">Essential Cookies</Label>
                <p className="text-muted-foreground text-xs">
                  Required for the website to function properly. Cannot be
                  disabled.
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label
                  htmlFor="cookie-analytics"
                  className="text-sm font-medium"
                >
                  Analytics Cookies
                </Label>
                <p className="text-muted-foreground text-xs">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <Switch id="cookie-analytics" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.75">
                <Label
                  htmlFor="cookie-marketing"
                  className="text-sm font-medium"
                >
                  Marketing Cookies
                </Label>
                <p className="text-muted-foreground text-xs">
                  Used to deliver personalized advertisements and track ad
                  campaign performance.
                </p>
              </div>
              <Switch id="cookie-marketing" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline">Save Preferences</Button>
            <Button>Accept All</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
