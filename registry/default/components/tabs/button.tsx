import { Badge } from '@/registry/default/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';
import { Bell, UserRound } from 'lucide-react';

export default function TabsDemo() {
  return (
    <Tabs
      defaultValue="profile"
      className="w-[375px] text-sm text-muted-foreground"
    >
      <TabsList variant="button" className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">
          <UserRound /> Profile
        </TabsTrigger>
        <TabsTrigger value="notifications">
          <Bell />
          Notifications
          <Badge variant="destructive" shape="circle" size="xs">
            5
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Content for Profile</TabsContent>
      <TabsContent value="notifications">Content for Notifications</TabsContent>
    </Tabs>
  );
}
