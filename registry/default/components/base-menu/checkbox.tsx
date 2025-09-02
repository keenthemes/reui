import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuSeparator,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>} />
      <MenuPortal>
        <MenuPositioner sideOffset={4}>
          <MenuPopup className="w-64">
            {/* Notifications */}
            <MenuGroup>
              <MenuGroupLabel>Notifications</MenuGroupLabel>
              <MenuSeparator />
              <MenuCheckboxItem defaultChecked>Push Notifications</MenuCheckboxItem>
              <MenuCheckboxItem defaultChecked>Email Notifications</MenuCheckboxItem>
              <MenuCheckboxItem>Security Alerts</MenuCheckboxItem>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
