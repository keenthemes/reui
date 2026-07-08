import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/registry/bases/radix/ui/navigation-menu"

export default function Pattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-80">
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#">
                      <div className="flex flex-col gap-1 px-1">
                        <div className="font-medium">Introduction</div>
                        <div className="text-muted-foreground line-clamp-2 text-sm">
                          Re-usable components built with Tailwind CSS.
                        </div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#">
                      <div className="flex flex-col gap-1 px-1">
                        <div className="font-medium">Installation</div>
                        <div className="text-muted-foreground line-clamp-2 text-sm">
                          How to install dependencies and structure your app.
                        </div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a href="#">Documentation</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
