// Description: Tabs with icons
// Order: 6
// GridSize: 1

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList className="w-full">
          <TabsTrigger value="overview">
            <IconPlaceholder
              lucide="LayoutDashboardIcon"
              tabler="IconLayoutDashboard"
              hugeicons="DashboardSquare02Icon"
              phosphor="LayoutIcon"
              remixicon="RiDashboardLine"
              className="size-4"
            />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <IconPlaceholder
              lucide="BarChart3Icon"
              tabler="IconChartBar"
              hugeicons="ChartBarLineIcon"
              phosphor="ChartBarIcon"
              remixicon="RiBarChartBoxLine"
              className="size-4"
            />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="SettingsIcon"
              phosphor="GearIcon"
              remixicon="RiSettings3Line"
              className="size-4"
            />
            Settings
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent>Overview dashboard content goes here.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardContent>Analytics charts and metrics.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardContent>Application settings and preferences.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
