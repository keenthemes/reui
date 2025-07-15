import fs from 'fs/promises';
import path from 'path';
import { codeToHtml } from 'shiki';

// Import the blocks config (we'll need to handle ES modules)
const blocksConfigPath = path.resolve('./config/blocks.ts');
const sourceBasePath = path.resolve('./registry/default/blocks');
const cacheBasePath = path.join(process.cwd(), 'registry', '.cache', 'default', 'blocks');

async function ensureCacheDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function loadBlocksConfig() {
  try {
    // For now, we'll parse the TypeScript file manually
    // In production, you might want to use a proper TypeScript loader
    const configContent = await fs.readFile(blocksConfigPath, 'utf-8');

    // Extract the config object (this is a simplified approach)
    // In production, consider using a proper TypeScript parser
    const configMatch = configContent.match(/export const blocksConfig.*?=\s*(\[[\s\S]*?\]);/);
    if (!configMatch) {
      throw new Error('Could not parse blocksConfig from blocks.ts');
    }

    // This is a simplified approach - you might want to use a proper parser
    return eval('(' + configMatch[1] + ')');
  } catch (error) {
    console.error('Error loading blocks config:', error);
    // Return a fallback empty config
    return [];
  }
}

function getAllSecondaryCategories(config) {
  const categories = [];

  for (const primary of config) {
    if (primary.sub) {
      for (const secondary of primary.sub) {
        // Include all secondary categories regardless of blocks content
        // blocks is now array of BlockItem objects
        categories.push({
          primary: primary.slug,
          secondary: secondary.slug,
          title: secondary.title,
          blockItems: secondary.blocks || [], // blocks is now array of BlockItem objects
          cacheKey: `${primary.slug}.${secondary.slug}`,
        });
      }
    }
  }

  return categories;
}

async function getBlockFilesInCategory(primary, secondary) {
  try {
    const categoryPath = path.join(sourceBasePath, primary, secondary);
    console.log(`     Checking directory: ${categoryPath}`);

    const entries = await fs.readdir(categoryPath, { withFileTypes: true });
    const blockFiles = entries
      .filter((entry) => entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')))
      .map((entry) => ({
        filename: entry.name,
        relativePath: path.join(primary, secondary, entry.name),
        fullPath: path.join(categoryPath, entry.name),
      }));

    console.log(`     Found ${blockFiles.length} block files: ${blockFiles.map((f) => f.filename).join(', ')}`);
    return blockFiles;
  } catch {
    // Try alternative directory names (handle plural/singular mismatches)
    const alternativePaths = [
      path.join(sourceBasePath, primary, secondary.replace(/s$/, '')), // Remove trailing 's'
      path.join(sourceBasePath, primary, secondary + 's'), // Add trailing 's'
    ];

    for (const altPath of alternativePaths) {
      try {
        console.log(`     Trying alternative directory: ${altPath}`);
        const entries = await fs.readdir(altPath, { withFileTypes: true });
        const blockFiles = entries
          .filter((entry) => entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')))
          .map((entry) => ({
            filename: entry.name,
            relativePath: path.join(primary, secondary, entry.name), // Use original secondary slug, not the directory name
            fullPath: path.join(altPath, entry.name),
          }));

        if (blockFiles.length > 0) {
          console.log(
            `     ✓ Found ${blockFiles.length} block files in alternative path: ${blockFiles.map((f) => f.filename).join(', ')}`,
          );
          return blockFiles;
        }
      } catch {
        // Continue trying other alternatives
      }
    }

    console.log(`     ⚠️ Directory not found: ${path.join(sourceBasePath, primary, secondary)}`);
    return [];
  }
}

async function processBlockFile(blockFile, blockItem) {
  try {
    const code = await fs.readFile(blockFile.fullPath, 'utf-8');

    // Generate syntax highlighted code
    const highlightedCode = await codeToHtml(code, {
      lang: 'tsx',
      theme: 'github-dark-default',
      transformers: [
        {
          code(node) {
            node.properties['data-line-numbers'] = '';
          },
        },
      ],
    });

    // Extract block name from filename (remove extension)
    const blockName = path.basename(blockFile.filename, path.extname(blockFile.filename));

    return {
      slug: blockItem.slug,
      name: blockItem.name || blockName,
      filename: blockFile.filename,
      code,
      highlightedCode,
      path: blockItem.path || blockFile.relativePath.replace(/\.(tsx|ts)$/, ''), // Use relativePath without extension if no path in config
      published: blockItem.published ?? true,
      new: blockItem.new ?? false,
      previewHeight: blockItem.previewHeight,
      relativePath: blockFile.relativePath,
    };
  } catch (error) {
    console.error(`Error processing ${blockFile.filename}:`, error);
    return null;
  }
}

async function processCategory(category) {
  try {
    console.log(`   📁 Category: ${category.cacheKey} (${category.blockItems?.length || 0} block items)`);

    // Get block files from the category-specific directory
    const blockFiles = await getBlockFilesInCategory(category.primary, category.secondary);

    const processedBlocks = [];

    // Process each block item defined in the config
    if (category.blockItems && category.blockItems.length > 0) {
      console.log(`     Processing ${category.blockItems.length} block items...`);

      for (const blockItem of category.blockItems) {
        console.log(`     Looking for block: ${blockItem.slug}`);

        // Find the corresponding block file
        // Look for files that match the block slug
        const matchingFile = blockFiles.find((file) => {
          const baseName = path.basename(file.filename, path.extname(file.filename));
          const matches =
            baseName === blockItem.slug ||
            baseName === `block-${blockItem.slug}` ||
            file.filename === blockItem.filename;

          if (matches) {
            console.log(`     ✓ Found matching file: ${file.filename} for block: ${blockItem.slug}`);
          }
          return matches;
        });

        if (matchingFile) {
          console.log(`     Processing block file: ${matchingFile.filename}`);
          const processedBlock = await processBlockFile(matchingFile, blockItem);
          if (processedBlock) {
            processedBlocks.push(processedBlock);
            console.log(`     ✓ Successfully processed: ${processedBlock.slug}`);
          }
        } else {
          console.warn(`     ⚠️  Block file not found for "${blockItem.slug}"`);
          console.warn(`     Available files: ${blockFiles.map((f) => f.filename).join(', ')}`);
        }
      }
    } else {
      console.log(`     No block items defined for ${category.cacheKey}`);
    }

    console.log(`   ✓ ${category.cacheKey}: ${processedBlocks.length} blocks processed`);
    return {
      ...category,
      blocks: processedBlocks,
    };
  } catch (error) {
    console.error(`Error processing category ${category.cacheKey}:`, error);
    return {
      ...category,
      blocks: [],
    };
  }
}

async function generateCategoryCache(category) {
  try {
    const cacheFileName = `${category.cacheKey}.json`;
    const cacheFilePath = path.join(cacheBasePath, cacheFileName);

    const cacheData = {
      category: {
        primary: category.primary,
        secondary: category.secondary,
        title: category.title,
        cacheKey: category.cacheKey,
      },
      blocks: category.blocks,
      total: category.blocks.length,
      generatedAt: new Date().toISOString(),
    };

    await ensureCacheDir(cacheBasePath);
    await fs.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2), 'utf-8');
    console.log(`✓ Cached: ${category.cacheKey} → ${category.blocks.length} blocks`);

    return cacheData;
  } catch (error) {
    console.error(`Error generating cache for ${category.cacheKey}:`, error);
    return null;
  }
}

async function generateMasterIndex(categoryCaches) {
  try {
    const indexPath = path.join(cacheBasePath, 'index.json');
    const validCaches = categoryCaches.filter(Boolean);

    const indexData = {
      categories: validCaches.map((cache) => ({
        cacheKey: cache.category.cacheKey,
        primary: cache.category.primary,
        secondary: cache.category.secondary,
        title: cache.category.title,
        totalBlocks: cache.total,
        filename: `${cache.category.cacheKey}.json`,
      })),
      totalCategories: validCaches.length,
      totalBlocks: validCaches.reduce((sum, cache) => sum + cache.total, 0),
      generatedAt: new Date().toISOString(),
    };

    await fs.writeFile(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');
    console.log(`✓ Generated master index: ${validCaches.length} categories, ${indexData.totalBlocks} total blocks`);
  } catch (error) {
    console.error('Error generating master index:', error);
  }
}

async function generateBlockCaches() {
  try {
    console.log('🚀 Starting block cache generation...');
    console.log(`📁 Source: ${sourceBasePath}`);
    console.log(`💾 Cache: ${cacheBasePath}`);
    console.log('');

    await ensureCacheDir(cacheBasePath);

    // Load blocks configuration
    console.log('📖 Loading blocks configuration...');
    const blocksConfig = await loadBlocksConfig();
    const secondaryCategories = getAllSecondaryCategories(blocksConfig);
    console.log(`   Found ${secondaryCategories.length} secondary categories`);
    console.log('');

    // Process each category and its blocks
    console.log('🔄 Processing categories and blocks...');
    const processedCategories = [];
    for (const category of secondaryCategories) {
      const result = await processCategory(category);
      if (result) {
        processedCategories.push(result);
      }
    }
    console.log('');

    // Generate category cache files (only for categories with blocks)
    console.log('💾 Generating category caches...');
    const categoryCaches = [];
    const categoriesWithBlocks = processedCategories.filter((category) => category.blocks.length > 0);

    console.log(
      `   Found ${categoriesWithBlocks.length} categories with blocks out of ${processedCategories.length} total categories`,
    );

    for (const category of categoriesWithBlocks) {
      const result = await generateCategoryCache(category);
      if (result) {
        categoryCaches.push(result);
      }
    }
    console.log('');

    // Generate master index
    console.log('📋 Generating master index...');
    await generateMasterIndex(categoryCaches);
    console.log('');

    console.log('✅ Block caches generated successfully!');
    console.log(`📊 Total: ${categoryCaches.length} category caches`);
    console.log(`📁 Cache location: ${cacheBasePath}`);
    console.log('');
    console.log('📝 Cache files generated:');
    categoryCaches.forEach((cache) => console.log(`   - ${cache.category.cacheKey}.json (${cache.total} blocks)`));
  } catch (error) {
    console.error('❌ Error generating block caches:', error);
  }
}

generateBlockCaches();
