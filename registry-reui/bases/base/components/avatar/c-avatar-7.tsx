// Description: Avatar with badge icon
// Order: 7

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?w=96&h=96&dpr=2&q=80"
          alt="Nick Johnson"
        />
        <AvatarFallback>NJ</AvatarFallback>
        <AvatarBadge>
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
          alt="Alex Johnson (away)"
        />
        <AvatarFallback>AJ</AvatarFallback>
        <AvatarBadge className="bg-success">
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=96&h=96&dpr=2&q=80"
          alt="Sarah Chen"
        />
        <AvatarFallback>SC</AvatarFallback>
        <AvatarBadge className="bg-warning">
          <IconPlaceholder
            lucide="StarIcon"
            tabler="IconStar"
            hugeicons="StarIcon"
            phosphor="StarIcon"
            remixicon="RiStarLine"
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
      <Avatar className="relative">
        <AvatarImage
          src="https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=96&h=96&dpr=2&q=80"
          alt="Michael Rodriguez"
        />
        <AvatarFallback>MR</AvatarFallback>
        <AvatarBadge className="bg-info">
          <IconPlaceholder
            lucide="ShieldCheckIcon"
            tabler="IconShieldCheck"
            hugeicons="ShieldEnergyIcon"
            phosphor="ShieldCheckIcon"
            remixicon="RiShieldCheckLine"
            aria-hidden="true"
          />
        </AvatarBadge>
      </Avatar>
    </div>
  )
}
