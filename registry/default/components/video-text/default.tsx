import { VideoText } from '@/registry/default/ui/video-text';
import { toAbsoluteUrl } from '@/lib/helpers';

export default function Component() {
  return (
    <div className="flex items-center justify-center">
      {/* Basic example */}
      <VideoText src={toAbsoluteUrl('/media/videos/1.mp4')} className="tracking-tight font-bold" fontSize="12rem">
        REUI
      </VideoText>
    </div>
  );
}
