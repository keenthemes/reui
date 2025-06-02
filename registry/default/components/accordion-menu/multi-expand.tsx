'use client';

import {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuIndicator,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
} from '@/registry/default/ui/accordion-menu';
import { Alert, AlertIcon, AlertTitle } from '@/registry/default/ui/alert';
import { Badge } from '@/registry/default/ui/badge';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Briefcase, LifeBuoy, Mail, Settings, User } from 'lucide-react';
import { toast } from 'sonner';

export default function AccordionMenuWithSubmenusDemo() {
  return (
    <div className="w-full md:w-[250px] overflow-hidden border border-border rounded-md p-2">
      <AccordionMenu
        type="multiple"
        defaultValue={['preferences', 'messages']}
        selectedValue="preferences-general"
        classNames={{
          separator: '-mx-2 mb-2.5',
        }}
      >
        {/* Main Menu Label */}
        <AccordionMenuLabel>Navigation</AccordionMenuLabel>
        <AccordionMenuSeparator />

        <AccordionMenuGroup>
          {/* Single Menu Item: Account Overview */}
          <AccordionMenuItem
            value="overview"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <RiCheckboxCircleFill />
                  </AlertIcon>
                  <AlertTitle>Account Overview clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <User />
            <span>Account Overview</span>
          </AccordionMenuItem>

          {/* Menu Item with Submenu: Message Center */}
          <AccordionMenuSub value="messages">
            <AccordionMenuSubTrigger>
              <Mail />
              <span>Message Center</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="messages">
              <AccordionMenuGroup>
                <AccordionMenuItem
                  value="inbox"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Inbox clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Inbox</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="sent"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Sent Items clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Sent Items</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="drafts"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Drafts clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Drafts</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="spam"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="destructive" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Spam clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Spam</span>
                </AccordionMenuItem>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Menu Item with Submenu: Preferences */}
          <AccordionMenuSub value="preferences">
            <AccordionMenuSubTrigger>
              <Settings />
              <span>Preferences</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="preferences">
              <AccordionMenuGroup>
                <AccordionMenuItem
                  value="preferences-general"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>General Settings clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>General</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="preferences-privacy"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Privacy Settings clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Privacy</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="preferences-notifications"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Notifications clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Notifications</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="preferences-display"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Display Settings clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Display</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="preferences-language"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <RiCheckboxCircleFill />
                        </AlertIcon>
                        <AlertTitle>Language Settings clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Language</span>
                </AccordionMenuItem>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>

          {/* Single Menu Item: Company Info */}
          <AccordionMenuItem
            value="companyInfo"
            onClick={() =>
              toast.custom((t) => (
                <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                  <AlertIcon>
                    <Briefcase />
                  </AlertIcon>
                  <AlertTitle>Company Info clicked</AlertTitle>
                </Alert>
              ))
            }
          >
            <Briefcase />
            <span>Company Info</span>
            <AccordionMenuIndicator>
              <Badge size="sm">5</Badge>
            </AccordionMenuIndicator>
          </AccordionMenuItem>

          {/* Menu Item with Submenu: Support Center */}
          <AccordionMenuSub value="support">
            <AccordionMenuSubTrigger>
              <LifeBuoy />
              <span>Support Center</span>
              <AccordionMenuIndicator />
            </AccordionMenuSubTrigger>
            <AccordionMenuSubContent type="multiple" parentValue="support">
              <AccordionMenuGroup>
                <AccordionMenuItem
                  value="faq"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <LifeBuoy />
                        </AlertIcon>
                        <AlertTitle>FAQ clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>FAQ</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="contact"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <LifeBuoy />
                        </AlertIcon>
                        <AlertTitle>Contact Us clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Contact Us</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="support-tickets"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <LifeBuoy />
                        </AlertIcon>
                        <AlertTitle>Support Tickets clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Support Tickets</span>
                </AccordionMenuItem>
                <AccordionMenuItem
                  value="live-chat"
                  onClick={() =>
                    toast.custom((t) => (
                      <Alert variant="mono" icon="primary" onClose={() => toast.dismiss(t)}>
                        <AlertIcon>
                          <LifeBuoy />
                        </AlertIcon>
                        <AlertTitle>Live Chat clicked</AlertTitle>
                      </Alert>
                    ))
                  }
                >
                  <span>Live Chat</span>
                </AccordionMenuItem>
              </AccordionMenuGroup>
            </AccordionMenuSubContent>
          </AccordionMenuSub>
        </AccordionMenuGroup>
      </AccordionMenu>
    </div>
  );
}
