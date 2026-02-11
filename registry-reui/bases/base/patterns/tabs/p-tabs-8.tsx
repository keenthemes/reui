// Description: Tabs with icons and line variant
// Order: 8
// GridSize: 1

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Card, CardContent } from "@/registry/bases/base/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/bases/base/ui/tabs"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    description: "For individuals and small projects",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
        className="size-5"
      />
    ),
    tablerIcon: "IconUser",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    description: "For growing teams and businesses",
    icon: (
      <IconPlaceholder
        lucide="ZapIcon"
        tabler="IconBolt"
        hugeicons="ZapIcon"
        phosphor="LightningIcon"
        remixicon="RiFlashlightLine"
        className="size-5"
      />
    ),
    tablerIcon: "IconBolt",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    description: "For large organizations",
    icon: (
      <IconPlaceholder
        lucide="BuildingIcon"
        tabler="IconBuilding"
        hugeicons="Building01Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuildingLine"
        className="size-5"
      />
    ),
    tablerIcon: "IconBuilding",
  },
]

export default function Pattern() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Tabs defaultValue="projects" orientation="vertical" className="gap-5">
        <TabsList variant="line" className="w-48 shrink-0">
          <TabsTrigger value="projects" className="justify-start gap-2">
            <IconPlaceholder
              lucide="FolderIcon"
              tabler="IconFolder"
              hugeicons="FolderIcon"
              phosphor="FolderIcon"
              remixicon="RiFolderLine"
              className="size-4"
            />
            Projects
            <Badge variant="secondary" size="sm" className="ml-auto">
              8
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="justify-start gap-2">
            <IconPlaceholder
              lucide="CheckSquareIcon"
              tabler="IconCheckbox"
              hugeicons="CheckListIcon"
              phosphor="CheckSquareIcon"
              remixicon="RiCheckboxLine"
              className="size-4"
            />
            Tasks
            <Badge variant="primary-light" size="sm" className="ml-auto">
              24
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="team" className="justify-start gap-2">
            <IconPlaceholder
              lucide="UsersIcon"
              tabler="IconUsers"
              hugeicons="UserGroupIcon"
              phosphor="UsersIcon"
              remixicon="RiGroupLine"
              className="size-4"
            />
            Team
          </TabsTrigger>
          <TabsTrigger value="reports" className="justify-start gap-2">
            <IconPlaceholder
              lucide="FileTextIcon"
              tabler="IconFileText"
              hugeicons="File02Icon"
              phosphor="FileTextIcon"
              remixicon="RiFileTextLine"
              className="size-4"
            />
            Reports
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                Active Projects
              </h3>
              <p>8 projects are currently in progress across your workspace.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tasks">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                Pending Tasks
              </h3>
              <p>24 tasks need your attention this week.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="team">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">
                Team Members
              </h3>
              <p>Manage your team and their access permissions.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card>
            <CardContent>
              <h3 className="text-foreground mb-2 font-semibold">Reports</h3>
              <p>View generated reports and export data.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
