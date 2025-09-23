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
import { Button } from '@/registry/default/ui/button';
import { Input } from '@/registry/default/ui/input';
import { Label } from '@/registry/default/ui/label';
import { Textarea } from '@/registry/default/ui/textarea';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

export default function DemoSheet() {
  return (
    <div className="flex items-center gap-6">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          <ArrowUp /> Top
        </SheetTrigger>
        <SheetContent side="top">
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
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          <ArrowRight /> Right
        </SheetTrigger>
        <SheetContent side="right">
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
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          <ArrowDown /> Bottom
        </SheetTrigger>
        <SheetContent side="bottom">
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
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          <ArrowLeft /> Left
        </SheetTrigger>
        <SheetContent side="left">
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
    </div>
  );
}
