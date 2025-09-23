import type { MetadataRoute } from 'next';
import { sitemapConfig } from '../config/sitemap';

export default function sitemap(): MetadataRoute.Sitemap {
  const home = {
    url: 'https://reui.io',
  };

  const docsLinks = (sitemapConfig.docsNav.find((section) => section.title === 'Components')?.items ?? [])
    .filter((item) => !!item.href)
    .map((item) => ({ url: `https://reui.io${item.href}` }));

  return [home, ...docsLinks];
}
