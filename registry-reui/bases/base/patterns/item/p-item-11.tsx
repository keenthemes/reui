// Description: Integration items with connect actions
// Order: 11

import { Badge } from "@/registry-reui/bases/base/reui/badge"

import { Button } from "@/registry/bases/base/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="GitBranchIcon"
              tabler="IconGitBranch"
              hugeicons="GitBranchIcon"
              phosphor="GitBranchIcon"
              remixicon="RiGitBranchLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>GitHub</ItemTitle>
            <ItemDescription>
              Connect repositories and sync code
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="FigmaIcon"
              tabler="IconBrandFigma"
              hugeicons="FigmaIcon"
              phosphor="FigmaLogoIcon"
              remixicon="RiFigmaLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Figma</ItemTitle>
            <ItemDescription>
              Import designs and sync components
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant="success-light" size="sm">
              Connected
            </Badge>
          </ItemActions>
        </Item>
        <Item variant="outline" size="xs">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="SlackIcon"
              tabler="IconBrandSlack"
              hugeicons="SlackIcon"
              phosphor="SlackLogoIcon"
              remixicon="RiSlackLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Slack</ItemTitle>
            <ItemDescription>Send notifications to channels</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Connect
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </div>
  )
}
