import { blocksConfig } from '@/config/blocks';
import { BlockItem, BlockPrimaryCategory, BlockSecondaryCategory, BlockTertiaryCategory } from '@/config/types';

// Get the active category from the current path
export function getPrimaryCategory(path: string): BlockPrimaryCategory | null {
  const pathSegments = path.split('/');

  if (pathSegments[1] === 'blocks') {
    // If there's a specific category in the URL, use it
    if (pathSegments[2]) {
      return blocksConfig.find((cat) => cat.slug === pathSegments[2]) || null;
    }
    // Default to the category marked as default when on /blocks
    return blocksConfig.find((cat) => cat.default === true) || null;
  }
  return null;
}

export function getSecondaryCategory(
  primaryCategory: BlockPrimaryCategory | null,
  path: string,
): BlockSecondaryCategory | null {
  if (!primaryCategory) return null;

  const pathSegments = path.split('/');

  if (pathSegments[1] === 'blocks') {
    // If there's a specific secondary category in the URL, use it
    if (pathSegments[3]) {
      return primaryCategory.sub?.find((cat) => cat.slug === pathSegments[3]) || null;
    }
    // Default to the first secondary category
    return primaryCategory.sub?.[0] || null;
  }
  return null;
}

export function getTertiaryCategory(
  secondaryCategory: BlockSecondaryCategory | null,
  path: string,
): BlockTertiaryCategory | null {
  if (!secondaryCategory) return null;

  const pathSegments = path.split('/');

  if (pathSegments[1] === 'blocks') {
    // If there's a specific tertiary category in the URL, use it
    if (pathSegments[4]) {
      return secondaryCategory.sub?.find((cat) => cat.slug === pathSegments[4]) || null;
    }
    // Default to the first tertiary category
    return secondaryCategory.sub?.[0] || null;
  }
  return null;
}

// Get blocks from cache - loads cached blocks JSON and returns as object
export async function getBlocks(
  primaryCategory: BlockPrimaryCategory | null,
  secondaryCategory: BlockSecondaryCategory | null,
  tertiaryCategory: BlockTertiaryCategory | null,
): Promise<BlockItem[]> {
  if (!primaryCategory || !secondaryCategory || !tertiaryCategory) return [];

  // Build cache key from category slugs
  const cacheKey = `${primaryCategory.slug}.${secondaryCategory.slug}.${tertiaryCategory.slug}`;

  try {
    // Load and resolve cached blocks JSON to object
    const cachedBlocks = await import(`@/registry/.cache/default/blocks/${cacheKey}.json`, {
      assert: { type: 'json' },
    });

    const plainData = JSON.parse(JSON.stringify(cachedBlocks.default || cachedBlocks));

    // Return the blocks array from cache
    return plainData.blocks || [];
  } catch (error) {
    console.warn(`Failed to load blocks cache for ${cacheKey}:`, error);
    return [];
  }
}
