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
import { Briefcase, Mail, Settings, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AccordionMenuDemo() {
  return (
    <div className="w-full md:w-[200px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        type="single"
        collapsible
        defaultValue=""
        selectedValue="selected"
        classNames={{
          separator: '-mx-2 mb-2.5',
        }}
      >
        <AccordionMenuLabel>States</AccordionMenuLabel>
        <AccordionMenuSeparator />
        <AccordionMenuGroup>
          <AccordionMenuItem
            value="default"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Default menu option clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <User />
            <span>Default</span>
          </AccordionMenuItem>

          <AccordionMenuItem
            value="selected"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Selected menu option clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <Mail />
            <span>Selected</span>
            <AccordionMenuIndicator>
              <Badge variant="primary" size="sm" shape="circle">
                8
              </Badge>
            </AccordionMenuIndicator>
          </AccordionMenuItem>
          <AccordionMenuItem value="disabled" disabled>
            <Settings />
            <span>Disabled</span>
          </AccordionMenuItem>
          <AccordionMenuItem
            value="companyInfo"
            variant="destructive"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <Briefcase />
                  </AlertIcon>
                  <AlertTitle>Destructive menu option clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <Briefcase />
            <span>Destructive</span>
          </AccordionMenuItem>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
