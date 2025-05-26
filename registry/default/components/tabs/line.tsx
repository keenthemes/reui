import { Badge } from '@/registry/default/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';
import { Bell, ShieldCheck, UserRound } from 'lucide-react';

export default function TabsDemo() {
  return (
    <Tabs defaultValue="profile" className="text-sm text-muted-foreground">
      <TabsList variant="line">
        <TabsTrigger value="profile">
          <UserRound /> Profile
        </TabsTrigger>
        <TabsTrigger value="security">
          <ShieldCheck /> Security
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
      <TabsContent value="security">Content for Security</TabsContent>
      <TabsContent value="notifications">Content for Notifications</TabsContent>
    </Tabs>
  );
}
