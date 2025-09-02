import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuArrow,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';
import { LogOut, Mail, Settings, User } from 'lucide-react';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>} />
      <MenuPortal>
        <MenuPositioner sideOffset={4}>
          <MenuPopup className="w-64">
            <MenuArrow />

            {/* Account Section */}
            <MenuGroup>
              <MenuGroupLabel>My Account</MenuGroupLabel>
              <MenuSeparator />
              <MenuItem>
                <User />
                <span>Profile</span>
                <MenuShortcut>⇧⌘P</MenuShortcut>
              </MenuItem>
              <MenuItem>
                <Mail />
                <span>Inbox</span>
                <MenuShortcut>⌘I</MenuShortcut>
              </MenuItem>
              <MenuItem>
                <Settings />
                <span>Settings</span>
                <MenuShortcut>⌘S</MenuShortcut>
              </MenuItem>
            </MenuGroup>

            {/* Logout */}
            <MenuSeparator />
            <MenuGroup>
              <MenuItem>
                <LogOut />
                <span>Log Out</span>
                <MenuShortcut>⇧⌘Q</MenuShortcut>
              </MenuItem>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
