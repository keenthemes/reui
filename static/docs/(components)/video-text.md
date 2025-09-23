## Installation

CLI
Manual

### 1.

Install the following dependencies:

```bash
npm i motion
```

Copy and paste the following code into your project's `components/ui/video-text.tsx` file.

## API Reference

This component is built using [Motion](https://motion.dev/) primitives and includes the following custom props:

### VideoText

| **Prop**                                                               | **Type**                              | **Default** |
| ---------------------------------------------------------------------- | ------------------------------------- | ----------- |
| `src` Video source URL or array of sources for multiple formats.       | ~string \| string[]~                  |             |
| `children` Content to display with video background effect.            | ~ReactNode~                           |             |
| `className` CSS class for the container element.                       | ~string~                              |             |
| `autoPlay` Whether to autoplay the video.                              | ~boolean~                             | ~true~      |
| `muted` Whether to mute the video audio.                               | ~boolean~                             | ~true~      |
| `loop` Whether to loop the video playback.                             | ~boolean~                             | ~true~      |
| `preload` Video preload strategy.                                      | ~enum~ "auto" \| "metadata" \| "none" | ~"auto"~    |
| `fontSize` Font size for the text mask in CSS units or viewport width. | ~string \| number~                    | ~"20vw"~    |
| `fontWeight` Font weight for the text mask.                            | ~string \| number~                    | ~"bold"~    |
| `as` HTML element type to render for the container.                    | ~ElementType~                         | ~"div"~     |
| `onPlay` Callback when video starts playing.                           | ~() => void~                          |             |
| `onPause` Callback when video is paused.                               | ~() => void~                          |             |
| `onEnded` Callback when video playback ends.                           | ~() => void~                          |             |

## Credits

- Inspired by [Magic UI](https://magicui.design/)
- Built with [Motion](https://motion.dev/).
