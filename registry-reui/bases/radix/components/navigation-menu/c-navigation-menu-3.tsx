import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/bases/radix/ui/navigation-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Status</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-2">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#" className="flex items-center gap-2">
                      <IconPlaceholder
                        lucide="CircleAlertIcon"
                        tabler="IconAlertCircle"
                        hugeicons="AlertCircleIcon"
                        phosphor="WarningCircleIcon"
                        remixicon="RiErrorWarningLine"
                      />
                      Backlog
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#" className="flex items-center gap-2">
                      <IconPlaceholder
                        lucide="CircleCheckIcon"
                        tabler="IconCircleCheck"
                        hugeicons="CheckmarkCircle01Icon"
                        phosphor="CheckCircleIcon"
                        remixicon="RiCheckboxCircleLine"
                      />
                      Done
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
