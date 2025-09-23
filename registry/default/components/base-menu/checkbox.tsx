import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuSeparator,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>} />
      <MenuContent sideOffset={4} className="w-50">
        {/* Notifications */}
        <MenuGroup>
          <MenuGroupLabel>Notifications</MenuGroupLabel>
          <MenuSeparator />
          <MenuCheckboxItem defaultChecked>Push Notifications</MenuCheckboxItem>
          <MenuCheckboxItem defaultChecked>Email Notifications</MenuCheckboxItem>
          <MenuCheckboxItem>Security Alerts</MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}
