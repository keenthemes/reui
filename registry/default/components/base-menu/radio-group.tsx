
import { Button } from '@/registry/default/ui/base-button';
import {
  Menu,
  MenuTrigger,
  MenuPortal,
  MenuPositioner,
  MenuPopup,
  MenuSeparator,
  MenuGroup,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
} from '@/registry/default/ui/base-menu';

export default function MenuDemo() {
  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline">Show Menu</Button>}/>
      <MenuPortal>
        <MenuPositioner sideOffset={4}>
          <MenuPopup className="w-64">          
            {/* Device Selection */}            
            <MenuGroup>
              <MenuGroupLabel>Device</MenuGroupLabel>
              <MenuSeparator />
              <MenuRadioGroup defaultValue="desktop">
                <MenuRadioItem value="desktop">
                  Desktop
                </MenuRadioItem>
                <MenuRadioItem value="mobile">
                  Mobile
                </MenuRadioItem>
                <MenuRadioItem value="tablet">
                  Tablet
                </MenuRadioItem>
              </MenuRadioGroup>
            </MenuGroup>
          </MenuPopup>
        </MenuPositioner>
      </MenuPortal>
    </Menu>
  );
}
