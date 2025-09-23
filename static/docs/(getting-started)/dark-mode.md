## Setup

### 1.

### 2. Add Dark Mode Variant

Ensure the following Tailwind Variant is added to your entry style file `styles/globals.css`:

```css
/** Dark Mode Variant **/
@custom-variant dark (&:where(.dark, .dark *));
```

### 3. Enable Dark Mode

To enable dark mode, toggle the `dark` class on the `` element.

```tsx
export default () => ({
  /* Your app */
});
```

> ℹ️ For Next.js projects we recommend using [next-themes](https://github.com/pacocoursey/next-themes) package for easy

    dark mode toggle support in your app.
