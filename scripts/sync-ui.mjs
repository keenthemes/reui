import { promises as fs } from 'fs';
import path from 'path';

// Define the source paths
const sourcePath = path.resolve('./registry/default/ui');

// List of files or folders to skip
const skipComponents = [];

// Define the destination paths
const destinationPaths = [
  path.resolve('../reui/components/ui'),
  path.resolve('../../market/nextjs-layouts/components/ui'),
  path.resolve('../../market/nextjs-storely/components/ui'),
  path.resolve(
    '../../../site-generator/themes/metronic-tailwind-react/typescript/vite/src/components/ui',
  ),
  path.resolve(
    '../../../site-generator/themes/metronic-tailwind-react/typescript/nextjs/components/ui',
  ),
];

// Function to check if a path exists
async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

// Function to check if a file or folder should be skipped
function shouldSkip(filePath) {
  return skipComponents.some((skipItem) => {
    if (skipItem.endsWith('/')) {
      return filePath.startsWith(path.join(sourcePath, skipItem));
    }
    return filePath.endsWith(skipItem);
  });
}

// Function to clear a folder
async function clearFolder(folderPath) {
  try {
    if (!(await pathExists(folderPath))) {
      console.warn(`⚠️ Folder does not exist, skipping: ${folderPath}`);
      return;
    }
    await fs.rm(folderPath, { recursive: true, force: true });
    console.log(`✅ Cleared folder: ${folderPath}`);
  } catch (error) {
    console.error(`❌ Error clearing folder: ${folderPath}`, error);
  }
}

// Function to copy files from one folder to another
async function copyFolder(src, dest) {
  try {
    await fs.mkdir(dest, { recursive: true });
    const files = await fs.readdir(src);

    for (const file of files) {
      const srcFile = path.join(src, file);
      const destFile = path.join(dest, file);
      const stat = await fs.stat(srcFile);

      if (shouldSkip(srcFile)) {
        console.warn(`⚠️ Skipped: ${srcFile}`);
        continue;
      }

      if (stat.isDirectory()) {
        await copyFolder(srcFile, destFile);
        console.log(`📂 Copied folder: ${srcFile} -> ${destFile}`);
      } else {
        await fs.mkdir(path.dirname(destFile), { recursive: true });
        const rawCode = await fs.readFile(srcFile, 'utf-8');
        const code = rawCode
          .replaceAll('@/registry/default/ui/', '@/components/ui/')
          .replaceAll('@/registry/default/hooks/', '@/hooks/')
          .replaceAll('@/registry/default/lib/', '@/lib/');
        await fs.writeFile(destFile, code, 'utf-8');
        console.log(
          `📄 Copied and transformed file: ${srcFile} -> ${destFile}`,
        );
      }
    }
  } catch (error) {
    console.error(`❌ Error copying from ${src} to ${dest}:`, error);
  }
}

// Main script to sync components
async function process(resetCache = false) {
  try {
    console.log('🚀 Starting migration...');

    if (!(await pathExists(sourcePath))) {
      console.error(`❌ Source folder does not exist: ${sourcePath}`);
      return;
    }

    for (const destPath of destinationPaths) {
      await fs.mkdir(destPath, { recursive: true }); // Ensure the destination exists

      if (resetCache) {
        await clearFolder(destPath); // Clear the destination folder before copying
      }

      await copyFolder(sourcePath, destPath);
    }

    console.log('✅ Migration complete.');
  } catch (error) {
    console.error('❌ Error during migration:', error);
  }
}

// Execute the script
process(true);
