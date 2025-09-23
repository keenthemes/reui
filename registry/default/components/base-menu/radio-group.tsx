import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from '@/registry/default/ui/base-menu';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>} />
      <MenuContent sideOffset={4} className="w-40">
        {/* Device Selection */}
        <MenuGroup>
          <MenuGroupLabel>Device</MenuGroupLabel>
          <MenuSeparator />
          <MenuRadioGroup defaultValue="desktop">
            <MenuRadioItem value="desktop">Desktop</MenuRadioItem>
            <MenuRadioItem value="mobile">Mobile</MenuRadioItem>
            <MenuRadioItem value="tablet">Tablet</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}
