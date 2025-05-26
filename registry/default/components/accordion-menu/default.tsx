'use client';

import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuIndicator,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
} from '@/registry/default/ui/accordion-menu';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Badge } from '@/registry/default/ui/badge';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { HelpCircle, Info, Mail, Settings, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AccordionMenuDemo() {
  return (
    <div className="w-full md:w-[200px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        type="single"
        collapsible
        classNames={{
          separator: '-mx-2 mb-2.5',
        }}
      >
        {/* Menu Label */}
        <AccordionMenuLabel>My Account</AccordionMenuLabel>
        <AccordionMenuSeparator />

        {/* Menu Items */}
        <AccordionMenuGroup>
          <AccordionMenuItem value="profile">
            <User />
            <span>Profile</span>
          </AccordionMenuItem>

          <AccordionMenuItem
            value="/inbox"
            onClick={() => {
              toast.custom((t) => (
                <Alert
                  variant="mono"
                  icon="primary"
                  onClose={() => toast.dismiss(t)}
                >
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Inbox clicked</AlertTitle>
                </Alert>
              ));
            }}
          >
            <Mail />
            <span>Inbox</span>
            <AccordionMenuIndicator>
              <Badge variant="primary" size="sm" shape="circle">
                5
              </Badge>
            </AccordionMenuIndicator>
          </AccordionMenuItem>

          <AccordionMenuItem
            value="settings"
            onClick={() => {
              toast.custom((t) => (
                <Alert
                  variant="mono"
                  icon="primary"
                  onClose={() => toast.dismiss(t)}
                >
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Settings clicked</AlertTitle>
                </Alert>
              ));
            }}
          >
            <Settings />
            <span>Settings</span>
          </AccordionMenuItem>

          <AccordionMenuItem value="about">
            <Info />
            <span>About</span>
          </AccordionMenuItem>

          <AccordionMenuItem value="help">
            <HelpCircle />
            <span>Help</span>
          </AccordionMenuItem>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
