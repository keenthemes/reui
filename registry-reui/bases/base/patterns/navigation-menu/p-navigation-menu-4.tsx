// Description: Navigation menu with grid layout and learn more button.
// Order: 4

import Link from "next/link"

import { Button } from "@/registry/bases/base/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/registry/bases/base/ui/navigation-menu"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const industries = [
  {
    title: "Individuals",
    description: "Keep your finances organized.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="UserIcon"
        tabler="IconUser"
        hugeicons="UserIcon"
        phosphor="UserIcon"
        remixicon="RiUserLine"
      />
    ),
  },
  {
    title: "LLCs",
    description: "Benefit from tax write-offs.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="BuildingIcon"
        tabler="IconBuilding"
        hugeicons="Building01Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuildingLine"
      />
    ),
  },
  {
    title: "Freelancers",
    description: "For independent workers.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="CircleDollarSignIcon"
        tabler="IconPremiumRights"
        hugeicons="DollarCircleIcon"
        phosphor="CurrencyCircleDollarIcon"
        remixicon="RiMoneyDollarCircleLine"
      />
    ),
  },
  {
    title: "Investors",
    description: "Make and grow your money.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="LayoutGridIcon"
        tabler="IconLayoutGrid"
        hugeicons="GridViewIcon"
        phosphor="SquaresFourIcon"
        remixicon="RiGalleryView2"
      />
    ),
  },
  {
    title: "Small businesses",
    description: "We take care of your taxes.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="SparklesIcon"
        tabler="IconSparkles"
        hugeicons="SparklesIcon"
        phosphor="SparkleIcon"
        remixicon="RiSparklingLine"
      />
    ),
  },
  {
    title: "Crypto",
    description: "For tech enthusiasts.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="CircleDollarSignIcon"
        tabler="IconPremiumRights"
        hugeicons="DollarCircleIcon"
        phosphor="CurrencyCircleDollarIcon"
        remixicon="RiMoneyDollarCircleLine"
      />
    ),
  },
  {
    title: "Big companies",
    description: "Run your finances easily.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="BuildingIcon"
        tabler="IconBuilding"
        hugeicons="Building01Icon"
        phosphor="BuildingsIcon"
        remixicon="RiBuildingLine"
      />
    ),
  },
  {
    title: "Investments",
    description: "Launch your ideas worldwide.",
    href: "#",
    icon: (
      <IconPlaceholder
        lucide="RadioIcon"
        tabler="IconBroadcast"
        hugeicons="LiveStreaming02Icon"
        phosphor="BroadcastIcon"
        remixicon="RiRfidLine"
      />
    ),
  },
]

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Industries</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px]2">
                <ul className="grid grid-cols-2 gap-1">
                  {industries.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        render={<Link href="#" />}
                        className="flex items-start gap-2 p-3"
                      >
                        {item.icon}
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm leading-none font-medium">
                            {item.title}
                          </div>
                          <p className="text-muted-foreground text-xs leading-snug">
                            {item.description}
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 px-1 pb-1">
                  <Button className="w-full" render={<Link href="#" />}>
                    Learn more
                  </Button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
