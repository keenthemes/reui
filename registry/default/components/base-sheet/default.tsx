import { Button } from '@/registry/default/ui/base-button';
import { Input } from '@/registry/default/ui/base-input';
import { Label } from '@/registry/default/ui/base-label';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/default/ui/base-sheet';
import { Textarea } from '@/registry/default/ui/textarea';

export default function DemoSheet() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open Sheet</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Quick Feedback</SheetTitle>
          <SheetDescription>Share your feedback to help us improve.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <div className="grid gap-5">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" />
            </div>
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Your Email" />
            </div>
            {/* Feedback */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea id="feedback" placeholder="Describe your suggestion." rows={4} />
              <p className="text-sm text-muted-foreground">Please don&apos;t include any sensitive information</p>
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose>Cancel</SheetClose>
          <Button type="submit">Submit</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
