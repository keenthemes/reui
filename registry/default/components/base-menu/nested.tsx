import { Badge } from '@/registry/default/ui/base-badge';
import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuArrow,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  MenuShortcut,
  MenuSubmenuRoot,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';
import {
  Bug,
  FileText,
  Globe,
  LogOut,
  Mail,
  Monitor,
  Package,
  Plus,
  Server,
  Settings,
  Shield,
  Trash,
  User,
  UserPlus,
  Users,
} from 'lucide-react';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Show Menu</MenuTrigger>
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

        {/* Team Management Section */}
        <MenuSeparator />
        <MenuGroup>
          <MenuGroupLabel>Team Management</MenuGroupLabel>
          <MenuSubmenuRoot>
            <MenuSubmenuTrigger>
              <Users />
              <span>Team Settings</span>
            </MenuSubmenuTrigger>
            <MenuContent sideOffset={-4} alignOffset={-4} className="min-w-[8rem]">
              <MenuItem disabled>
                <Shield />
                <span>Permissions</span>
              </MenuItem>
              <MenuItem>
                <UserPlus />
                <span>Invite Members</span>
              </MenuItem>
              <MenuSeparator />
              <MenuItem>
                <Monitor />
                <span>Monitor Activity</span>
              </MenuItem>
              <MenuItem>
                <FileText />
                <span>Logs</span>
              </MenuItem>
              <MenuItem>
                <Server />
                <span>Server Status</span>
              </MenuItem>
              <MenuItem>
                <Globe />
                <span>Web Traffic</span>
              </MenuItem>
              <MenuSeparator />
              <MenuItem variant="destructive">
                <Bug />
                <span>System Errors</span>
              </MenuItem>
            </MenuContent>
          </MenuSubmenuRoot>

          {/* Roles Submenu */}
          <MenuSubmenuRoot>
            <MenuSubmenuTrigger>
              <Shield />
              <span>Roles</span>
            </MenuSubmenuTrigger>
            <MenuContent sideOffset={-4} alignOffset={-4} className="min-w-[8rem]">
              <MenuItem>
                <Plus />
                <span>Add Role</span>
              </MenuItem>
              <MenuItem>
                <Users />
                <span>Assign Roles</span>
              </MenuItem>
              <MenuSeparator />
              <MenuItem variant="destructive">
                <Trash />
                <span>Delete Role</span>
              </MenuItem>
            </MenuContent>
          </MenuSubmenuRoot>

          <MenuItem>
            <Package />
            <span>Integrations</span>
            <Badge variant="destructive" shape="circle" size="xs" className="ms-auto">
              5
            </Badge>
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
