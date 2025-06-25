import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { AvatarGroup, AvatarGroupItem, AvatarGroupTooltip } from '@/registry/default/ui/avatar-group';

export default function Component() {
  const AVATARS = [
    {
      src: 'https://randomuser.me/api/portraits/men/77.jpg',
      fallback: 'A',
      name: 'Nick Stone',
      role: 'CEO, Loop Inc.',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/53.jpg',
      fallback: 'JS',
      name: 'Jessica Smith',
      role: 'CTO, Kite Inc.',
    },
    {
      src: 'https://randomuser.me/api/portraits/men/0.jpg',
      fallback: 'MJ',
      name: 'Michael Johnson',
      role: 'Developer, Sito Inc.',
    },
    {
      src: 'https://randomuser.me/api/portraits/women/24.jpg',
      fallback: 'SW',
      name: 'Samantha Williams',
      role: 'Manager, TPO Inc.',
    },
  ];

  return (
    <AvatarGroup tooltipClassName="">
      {AVATARS.map((avatar, index) => (
        <AvatarGroupItem key={index}>
          <Avatar className="size-12 rounded-full overflow-hidden border-4 border-background">
            <AvatarImage src={avatar.src} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
          <AvatarGroupTooltip className="flex flex-col gap-0.5 text-center">
            <span className="text-sm font-semibold">{avatar.name}</span>
            <span className="text-xs font-normal">{avatar.role}</span>
          </AvatarGroupTooltip>
        </AvatarGroupItem>
      ))}
    </AvatarGroup>
  );
}
