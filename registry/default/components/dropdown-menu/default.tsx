import { Badge } from '@/registry/default/ui/badge';
import { Button } from '@/registry/default/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/registry/default/ui/dropdown-menu';
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

export default function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Show Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {/* Account Section */}
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Mail />
            <span>Inbox</span>
            <DropdownMenuShortcut>⌘I</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Team Management Section */}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Team Management</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Users />
              <span>Team Settings</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem disabled>
                  <Shield />
                  <span>Permissions</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <UserPlus />
                  <span>Invite Members</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Monitor />
                    <span>Monitor Activity</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <FileText />
                        <span>Logs</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Server />
                        <span>Server Status</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Globe />
                        <span>Web Traffic</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        <Bug />
                        <span>System Errors</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {/* Roles Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Shield />
              <span>Roles</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Plus />
                  <span>Add Role</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users />
                  <span>Assign Roles</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash />
                  <span>Delete Role</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Package />
            <span className="grow flex items-center justify-between">
              <span>Integrations</span>
              <Badge variant="destructive" shape="circle" size="xs">
                5
              </Badge>
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Logout */}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut />
          <span>Log Out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
