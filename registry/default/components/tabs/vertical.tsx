import { Badge } from '@/registry/default/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';
import { Bell, ShieldCheck, UserRound } from 'lucide-react';
import { useComponentPreview } from '@/components/component-preview';

export default function TabsDemo() {
  const { rtl } = useComponentPreview();
  const dir = rtl ? 'rtl' : 'ltr';

  return (
    <Tabs
      defaultValue="profile"
      orientation="vertical"
      className="flex flex-col justify-stretch lg:flex-row gap-4 text-sm text-muted-foreground w-full lg:w-[500px] p-4 border border-border rounded-lg"
      dir={dir}
    >
      <div className="lg:w-[175px] lg:shrink-0">
        <TabsList
          variant="button"
          className="flex flex-col items-stretch *:justify-start"
        >
          <TabsTrigger value="profile">
            <UserRound /> Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <ShieldCheck /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell /> Notifications
            <Badge variant="destructive" shape="circle" size="xs">
              5
            </Badge>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="grow border-s border-border py-0 ps-4">
        <TabsContent value="profile">Content for Profile</TabsContent>
        <TabsContent value="security">Content for Security</TabsContent>
        <TabsContent value="notifications">
          Content for Notifications
        </TabsContent>
      </div>
    </Tabs>
  );
}
