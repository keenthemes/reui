'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/registry/default/ui/accordion-menu';
import {
  AlertCircle,
  Bell,
  Box,
  Calendar,
  CheckSquare,
  ChevronDown,
  Edit,
  Eye,
  FileText,
  Folder,
  Grid,
  Info,
  List,
  Logs,
  MessageCircle,
  Settings,
  Sliders,
  Star,
  User,
} from 'lucide-react';

export default function AccordionMenuDemo() {
  const pathname = usePathname();

  const matchPath = (path: string) =>
    path === pathname || (path.length > 1 && pathname.startsWith(path));

  return (
    <div className="w-full md:w-[250px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        selectedValue={pathname}
        matchPath={matchPath}
        type="single" // Kept as 'single' per your latest demo
        collapsible
        classNames={{ separator: '-mx-2 mb-2.5' }}
      >
        <AccordionMenuLabel>Components</AccordionMenuLabel>
        <AccordionMenuSeparator />

        <AccordionMenuGroup>
          {/* Level 1: Components */}
          <AccordionMenuSub value="components">
            <AccordionMenuSubTrigger>
              <Folder />
              <span>General</span>
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent
              type="single"
              collapsible
              parentValue="components"
            >
              <AccordionMenuGroup>
                {/* Level 2: Core Components */}
                <AccordionMenuItem value="/docs/accordion">
                  <Link href="/docs/accordion">
                    <Star />
                    <span>Accordion</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/button">
                  <Link href="/docs/button">
                    <Settings />
                    <span>Button</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/input">
                  <Link href="/docs/input">
                    <Edit />
                    <span>Input</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/select">
                  <Link href="/docs/select">
                    <List />
                    <span>Select</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuSub value="interactive">
                  <AccordionMenuSubTrigger>
                    <Grid />
                    <span>Interactive</span>
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent
                    type="single"
                    collapsible
                    parentValue="interactive"
                  >
                    <AccordionMenuGroup>
                      {/* Level 3: Interactive Components */}
                      <AccordionMenuItem value="/docs/tooltip">
                        <Link href="/docs/tooltip">
                          <MessageCircle />
                          <span>Tooltip</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/popover">
                        <Link href="/docs/popover">
                          <Bell />
                          <span>Popover</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/dropdown-menu">
                        <Link href="/docs/dropdown-menu">
                          <ChevronDown />
                          <span>Dropdown Menu</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/dialog">
                        <Link href="/docs/dialog">
                          <AlertCircle />
                          <span>Dialog</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/switch">
                        <Link href="/docs/switch">
                          <Sliders />
                          <span>Switch</span>
                        </Link>
                      </AccordionMenuItem>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
                <AccordionMenuSub value="data-display">
                  <AccordionMenuSubTrigger>
                    <Box />
                    <span>Data Display</span>
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent
                    type="single"
                    collapsible
                    parentValue="data-display"
                  >
                    <AccordionMenuGroup>
                      {/* Level 3: Data Display Components */}
                      <AccordionMenuItem value="/docs/table">
                        <Link href="/docs/table">
                          <FileText />
                          <span>Table</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/card">
                        <Link href="/docs/card">
                          <Box />
                          <span>Card</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/avatar">
                        <Link href="/docs/avatar">
                          <User />
                          <span>Avatar</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/badge">
                        <Link href="/docs/badge">
                          <Star />
                          <span>Badge</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/skeleton">
                        <Link href="/docs/skeleton">
                          <Eye />
                          <span>Skeleton</span>
                        </Link>
                      </AccordionMenuItem>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Level 1: Navigation */}
          <AccordionMenuSub value="navigation">
            <AccordionMenuSubTrigger>
              <Calendar />
              <span>Navigation</span>
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent
              type="single"
              collapsible
              parentValue="navigation"
            >
              <AccordionMenuGroup>
                <AccordionMenuItem value="/docs/separator">
                  <Link href="/docs/separator">
                    <FileText />
                    <span>Separator</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/tabs">
                  <Link href="/docs/tabs">
                    <Grid />
                    <span>Tabs</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuSub value="overlays">
                  <AccordionMenuSubTrigger>
                    <Info />
                    <span>Overlays</span>
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent
                    type="single"
                    collapsible
                    parentValue="overlays"
                  >
                    <AccordionMenuGroup>
                      {/* Level 3: Overlay Components */}
                      <AccordionMenuItem value="/docs/tooltip">
                        <Link href="/docs/tooltip">
                          <MessageCircle />
                          <span>Tooltip</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/accordion-menu">
                        <Link href="/docs/accordion-menu">
                          <Logs />
                          <span>Accordion Menu</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/popover">
                        <Link href="/docs/popover">
                          <Bell />
                          <span>Popover</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/dialog">
                        <Link href="/docs/dialog">
                          <AlertCircle />
                          <span>Dialog</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/sheet">
                        <Link href="/docs/sheet">
                          <Box />
                          <span>Sheet</span>
                        </Link>
                      </AccordionMenuItem>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Level 1: Utilities */}
          <AccordionMenuSub value="utilities">
            <AccordionMenuSubTrigger>
              <Settings />
              <span>Utilities</span>
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent
              type="single"
              collapsible
              parentValue="utilities"
            >
              <AccordionMenuGroup>
                <AccordionMenuItem value="/docs/scroll-area">
                  <Link href="/docs/scroll-area">
                    <Sliders />
                    <span>Scroll Area</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/sonner">
                  <Link href="/docs/sonner">
                    <Bell />
                    <span>Sonner</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/kbd">
                  <Link href="/docs/kbd">
                    <Edit />
                    <span>Kbd</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuItem value="/docs/collapsible">
                  <Link href="/docs/collapsible">
                    <CheckSquare />
                    <span>Collapsible</span>
                  </Link>
                </AccordionMenuItem>
                <AccordionMenuSub value="inputs">
                  <AccordionMenuSubTrigger>
                    <User />
                    <span>Inputs</span>
                  </AccordionMenuSubTrigger>
                  <AccordionMenuSubContent
                    type="single"
                    collapsible
                    parentValue="inputs"
                  >
                    <AccordionMenuGroup>
                      {/* Level 3: Input Components */}
                      <AccordionMenuItem value="/docs/checkbox">
                        <Link href="/docs/checkbox">
                          <CheckSquare />
                          <span>Checkbox</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/radio-group">
                        <Link href="/docs/radio-group">
                          <Star />
                          <span>Radio Group</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/slider">
                        <Link href="/docs/slider">
                          <Sliders />
                          <span>Slider</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/textarea">
                        <Link href="/docs/textarea">
                          <FileText />
                          <span>Textarea</span>
                        </Link>
                      </AccordionMenuItem>
                      <AccordionMenuItem value="/docs/date-picker">
                        <Link href="/docs/date-picker">
                          <Calendar />
                          <span>Date Picker</span>
                        </Link>
                      </AccordionMenuItem>
                    </AccordionMenuGroup>
                  </AccordionMenuSubContent>
                </AccordionMenuSub>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
