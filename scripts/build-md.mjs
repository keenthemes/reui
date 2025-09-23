import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { basename, dirname, extname, join } from 'path';

/**
 * Copy all MDX files from content/docs to static docs folder with .md extension
 */
async function buildMD() {
  try {
    const contentDocsPath = join(process.cwd(), 'content', 'docs');
    const publicDocsPath = join(process.cwd(), 'public', 'docs');

    // Create public/docs directory if it doesn't exist
    if (!existsSync(publicDocsPath)) {
      await mkdir(publicDocsPath, { recursive: true });
      console.log('📁 Created public/docs directory');
    }

    // Read all MDX files recursively
    const mdxFiles = await getAllMDXFiles(contentDocsPath);

    console.log(`📄 Found ${mdxFiles.length} MDX files to process`);

    for (const mdxFile of mdxFiles) {
      // Read the MDX content
      const content = await readFile(mdxFile, 'utf-8');

      // Convert MDX to Markdown (remove frontmatter and JSX)
      const markdownContent = convertMDXToMarkdown(content);

      // Calculate relative path from content/docs
      const relativePath = mdxFile.replace(contentDocsPath, '').replace(/^\//, '');

      // Flatten the structure - remove folder names and just use filename
      const fileName = basename(mdxFile, '.mdx');
      const mdPath = `${fileName}.md`;

      // Create output path (flat structure - no subdirectories)
      const outputPath = join(publicDocsPath, mdPath);

      // Write the markdown file
      await writeFile(outputPath, markdownContent, 'utf-8');

      console.log(`✅ Converted: ${relativePath} → ${mdPath}`);
    }

    console.log(`🎉 Successfully converted ${mdxFiles.length} MDX files to Markdown`);
    console.log(`📁 Output directory: ${publicDocsPath}`);
  } catch (error) {
    console.error('❌ Error building MD files:', error.message);
    process.exit(1);
  }
}

/**
 * Recursively find all MDX files in a directory
 */
async function getAllMDXFiles(dir) {
  const files = [];
  const { readdir, stat } = await import('fs/promises');

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // Recursively search subdirectories
        const subFiles = await getAllMDXFiles(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }

  return files;
}

/**
 * Convert MDX content to plain Markdown (preserving frontmatter)
 */
function convertMDXToMarkdown(content) {
  return (
    content
      // Keep frontmatter as-is (don't remove it)
      // Convert MDX components to markdown equivalents
      .replace(/<Alert[^>]*variant="([^"]*)"[^>]*>([\s\S]*?)<\/Alert>/g, (match, variant, content) => {
        const alertType = variant === 'destructive' ? '> ⚠️' : variant === 'success' ? '> ✅' : '> ℹ️';
        return `${alertType} ${content.replace(/<[^>]*>/g, '').trim()}\n`;
      })
      // Convert <Steps> to numbered list
      .replace(/<Steps>([\s\S]*?)<\/Steps>/g, (match, content) => {
        const steps = content.split(/###/).filter(Boolean);
        return steps.map((step, index) => `### ${index + 1}. ${step.trim()}`).join('\n\n');
      })
      // Remove JSX components
      .replace(/<[^>]*>/g, '')
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .trim()
  );
}

// Run the script
buildMD();
