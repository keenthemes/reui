import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
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
} from '@/registry/default/ui/sheet';
import { Textarea } from '@/registry/default/ui/textarea';
import { useDirection } from '@radix-ui/react-direction';

export default function DemoSheet() {
  const direction = useDirection();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet</Button>
      </SheetTrigger>
      <SheetContent dir={direction}>
        <SheetHeader>
          <SheetTitle>Quick Feedback</SheetTitle>
          <SheetDescription>
            Share your feedback to help us improve.
          </SheetDescription>
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
              <Textarea
                id="feedback"
                placeholder="Describe your suggestion."
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Please don’t include any sensitive information
              </p>
            </div>
          </div>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <SheetClose asChild>
            <Button type="submit">Submit Feedback</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
