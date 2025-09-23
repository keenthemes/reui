import { Avatar, AvatarFallback, AvatarImage } from '@/registry/default/ui/avatar';
import { PreviewCard, PreviewCardContent, PreviewCardTrigger } from '@/registry/default/ui/base-preview-card';

export default function BasePreviewCardDefault() {
  return (
    <PreviewCard>
      <PreviewCardTrigger className="text-sm">
        Learn more about <span className="text-primary underline underline-offset-4 cursor-help">@reui_io</span>.
      </PreviewCardTrigger>
      <PreviewCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://reui.io/brand/logo-default.png" />
            <AvatarFallback>RE</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@reui_io</h4>
            <p className="text-sm">
              Open-source collection of UI components and animated effects built with React, Typescript, Tailwind CSS,
              and Motion.
            </p>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}
