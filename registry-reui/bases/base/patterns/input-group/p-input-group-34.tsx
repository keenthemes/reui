// Description: Pill-shaped AI prompt bar with voice and audio icons
// Order: 34
// GridSize: 1

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/registry/bases/base/ui/dropdown-menu"
import { Field } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <Field className="max-w-3xl">
      <InputGroup className="bg-background style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full h-14 border p-1.5">
        <InputGroupAddon className="border-none pl-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <InputGroupButton
                  variant="ghost"
                  size="icon-sm"
                  className="text-muted-foreground hover:text-foreground style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-10"
                />
              }
            >
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
                className="size-6"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={12}
              className="w-56"
            >
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="PaperclipIcon"
                  tabler="IconPaperclip"
                  hugeicons="Attachment02Icon"
                  phosphor="PaperclipIcon"
                  remixicon="RiAttachment2"
                />
                <span>Add photos & files</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="-mx-3" />
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ImageIcon"
                  tabler="IconPhoto"
                  hugeicons="ImageIcon"
                  phosphor="ImageIcon"
                  remixicon="RiImageLine"
                />
                <span>Create image</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="BrainIcon"
                  tabler="IconBrain"
                  hugeicons="AiBrain01Icon"
                  phosphor="BrainIcon"
                  remixicon="RiBrainLine"
                />
                <span>Thinking</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="Search01Icon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
                <span>Deep research</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ShoppingBagIcon"
                  tabler="IconShoppingBag"
                  hugeicons="ShoppingBag01Icon"
                  phosphor="ShoppingBagOpenIcon"
                  remixicon="RiShoppingBag3Line"
                />
                <span>Shopping research</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <IconPlaceholder
                    lucide="SparklesIcon"
                    tabler="IconSparkles"
                    hugeicons="SparklesIcon"
                    phosphor="SparkleIcon"
                    remixicon="RiSparklingLine"
                  />
                  <span>More</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-44">
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="BookOpenIcon"
                      tabler="IconBook"
                      hugeicons="BookOpen01Icon"
                      phosphor="BookOpenIcon"
                      remixicon="RiBookOpenLine"
                    />
                    <span>Study and learn</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="GlobeIcon"
                      tabler="IconWorld"
                      hugeicons="Globe02Icon"
                      phosphor="GlobeSimpleIcon"
                      remixicon="RiGlobalLine"
                    />
                    <span>Web search</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="LayoutDashboardIcon"
                      tabler="IconLayoutDashboard"
                      hugeicons="DashboardSquare02Icon"
                      phosphor="LayoutIcon"
                      remixicon="RiDashboardLine"
                    />
                    <span>Canvas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder
                      lucide="AppWindowIcon"
                      tabler="IconAppWindow"
                      hugeicons="BrowserIcon"
                      phosphor="AppWindowIcon"
                      remixicon="RiWindowLine"
                    />
                    <span>Explore apps</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>

        <InputGroupInput
          placeholder="Ask anything"
          className="placeholder:text-muted-foreground/70 border-none px-2 text-lg shadow-none focus-visible:ring-0"
        />

        <InputGroupAddon align="inline-end" className="gap-2 border-none pr-1">
          <InputGroupButton
            variant="ghost"
            className="text-muted-foreground hover:text-foreground style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-11"
          >
            <IconPlaceholder
              lucide="MicIcon"
              tabler="IconMicrophone"
              hugeicons="Mic02Icon"
              phosphor="MicrophoneIcon"
              remixicon="RiMicLine"
              className="size-5"
            />
          </InputGroupButton>
          <InputGroupButton
            variant="default"
            className="style-vega:rounded-full style-nova:rounded-full style-lyra:rounded-none style-maia:rounded-full style-mira:rounded-full size-11 bg-black text-white hover:bg-black/90"
          >
            <IconPlaceholder
              lucide="AudioLinesIcon"
              tabler="IconBrandSoundcloud"
              hugeicons="AudioWave01Icon"
              phosphor="WaveformIcon"
              remixicon="RiSoundcloudLine"
              className="size-5"
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
