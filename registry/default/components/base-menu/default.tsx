import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuSeparator,
  MenuShortcut,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';
import { LogOut, Mail, Settings, User } from 'lucide-react';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>} />
      <MenuContent sideOffset={4} className="w-64">
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
      </MenuContent>
    </Menu>
  );
}
