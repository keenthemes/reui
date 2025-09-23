import type { MetadataRoute } from 'next';
import { sitemapConfig } from '../config/sitemap';
import type { FooterNavItem, MainNavItem, SidebarNavItem } from '../config/types';

function extractAllSidebarItems(items: SidebarNavItem[] = []): SidebarNavItem[] {
  const all: SidebarNavItem[] = [];
  for (const item of items) {
    if (!item) continue;
    all.push(item);
    if (Array.isArray(item.items) && item.items.length > 0) {
      all.push(...extractAllSidebarItems(item.items));
    }
    if (Array.isArray(item.children) && item.children.length > 0) {
      all.push(...extractAllSidebarItems(item.children));
    }
  }
  return all;
}

function toAbsolute(urlPath: string): string {
  return urlPath.startsWith('http') ? urlPath : `https://reui.io${urlPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Home page
  entries.push({ url: 'https://reui.io' });

  // Main navigation links
  const main: MainNavItem[] = sitemapConfig.mainNav ?? [];
  for (const item of main) {
    if (item?.href) entries.push({ url: toAbsolute(item.href) });
  }

  // Docs navigation (recursive)
  for (const section of sitemapConfig.docsNav ?? []) {
    const flat = extractAllSidebarItems(section.items || []);
    for (const item of flat) {
      if (item?.href) entries.push({ url: toAbsolute(item.href) });
    }
  }

  // Footer nav links
  const footer: FooterNavItem[] = sitemapConfig.footerNav ?? [];
  for (const item of footer) {
    if (item?.href) entries.push({ url: toAbsolute(item.href) });
  }

  // De-duplicate by url
  const unique = new Map<string, { url: string }>();
  for (const e of entries) unique.set(e.url, e);

  return Array.from(unique.values());
}
