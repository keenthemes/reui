// Description: Tabs with badge counts
// Order: 7
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"

export default function Pattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="inbox">
        <TabsList variant="line" className="mb-3.5 w-full">
          <TabsTrigger value="inbox" className="gap-2">
            Inbox
            <Badge variant="primary-light" size="sm">
              12
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-2">
            Drafts
            <Badge variant="info-light" size="sm">
              3
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            Sent
          </TabsTrigger>
          <TabsTrigger value="spam" className="gap-2">
            Spam
            <Badge variant="destructive-light" size="sm">
              24
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inbox">
          <Card>
            <CardContent>12 unread messages in your inbox.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="drafts">
          <Card>
            <CardContent>3 drafts waiting to be sent.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sent">
          <Card>
            <CardContent>All sent messages appear here.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="spam">
          <Card>
            <CardContent>24 spam messages detected.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
