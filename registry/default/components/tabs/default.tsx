import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/registry/default/ui/tabs';

export default function TabsDemo() {
  return (
    <Tabs
      defaultValue="profile"
      className="w-[375px] text-sm text-muted-foreground"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Content for Profile</TabsContent>
      <TabsContent value="notifications">Content for Security</TabsContent>
    </Tabs>
  );
}
