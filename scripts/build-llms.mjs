import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

/**
 * Generate LLMs data from sitemap configuration
 */
async function generateLLMsData() {
  try {
    // Read the sitemap.ts file
    const sitemapPath = join(process.cwd(), 'config', 'sitemap.ts');
    const sitemapContent = await readFile(sitemapPath, 'utf-8');

    // Generate the LLMs content
    let content = '# ReUI\n\n';
    content +=
      'This is the documentation for the `@reui/components` package. It contains a collection of components and utilities for building user interfaces in React. The library is designed to be composable and styling agnostic.\n\n';

    // Extract docsNav sections dynamically
    const docsNavMatch = sitemapContent.match(/docsNav: \[([\s\S]*?)\],\s*footerNav:/);
    if (docsNavMatch) {
      const docsNavContent = docsNavMatch[1];

      // Extract each section dynamically - use a more robust approach that properly handles nested objects
      // Manually extract Getting Started section first, then use regex for others
      let gettingStartedContent = '';
      const gettingStartedMatch = docsNavContent.match(/{\s*title: 'Getting Started',\s*items: \[([\s\S]*?)\],?\s*}/);
      if (gettingStartedMatch) {
        gettingStartedContent = gettingStartedMatch[1];
        content += `## Getting Started\n`;

        // Extract titles, hrefs, and descriptions separately and match by position
        const titles = gettingStartedContent.match(/title: '([^']+)'/g);
        const hrefs = gettingStartedContent.match(/href: '([^']+)'/g);
        const descriptions = gettingStartedContent.match(/description:\s*'([^']+)'/g);

        console.log(
          `Section: Getting Started, Titles: ${titles ? titles.length : 0}, Hrefs: ${hrefs ? hrefs.length : 0}, Descriptions: ${descriptions ? descriptions.length : 0}`,
        );

        if (titles && hrefs && descriptions && titles.length === hrefs.length && hrefs.length === descriptions.length) {
          for (let i = 0; i < titles.length; i++) {
            const title = titles[i].match(/title: '([^']+)'/)[1];
            const href = hrefs[i].match(/href: '([^']+)'/)[1];
            const description = descriptions[i].match(/description:\s*'([^']+)'/)[1];

            // Convert href to .md format with custom path for Introduction
            let mdHref;
            if (title === 'Introduction') {
              mdHref = '/docs/index.md';
            } else {
              mdHref = href.endsWith('.md') ? href : `${href}.md`;
            }
            const absoluteUrl = mdHref.startsWith('http') ? mdHref : `https://reui.io${mdHref}`;

            content += `- [${title}](${absoluteUrl}): ${description}\n`;
          }
        }
        content += '\n';
      }

      // Extract other sections using regex
      const sectionsMatch = docsNavContent.match(/{\s*title: '([^']+)',\s*items: \[([\s\S]*?)\],?\s*}/g);

      if (sectionsMatch) {
        sectionsMatch.forEach((section) => {
          const titleMatch = section.match(/title: '([^']+)'/);
          const itemsMatch = section.match(/items: \[([\s\S]*?)\]/);

          if (titleMatch && itemsMatch) {
            const sectionTitle = titleMatch[1];

            // Skip Getting Started since we handled it separately
            if (sectionTitle === 'Getting Started') {
              return;
            }

            content += `## ${sectionTitle}\n`;

            // Extract individual items from this section
            const itemsText = itemsMatch[1];

            // Extract titles, hrefs, and descriptions separately and match by position
            const titles = itemsText.match(/title: '([^']+)'/g);
            const hrefs = itemsText.match(/href: '([^']+)'/g);
            const descriptions = itemsText.match(/description:\s*'([^']+)'/g);

            console.log(
              `Section: ${sectionTitle}, Titles: ${titles ? titles.length : 0}, Hrefs: ${hrefs ? hrefs.length : 0}, Descriptions: ${descriptions ? descriptions.length : 0}`,
            );

            if (
              titles &&
              hrefs &&
              descriptions &&
              titles.length === hrefs.length &&
              hrefs.length === descriptions.length
            ) {
              for (let i = 0; i < titles.length; i++) {
                const title = titles[i].match(/title: '([^']+)'/)[1];
                const href = hrefs[i].match(/href: '([^']+)'/)[1];
                const description = descriptions[i].match(/description:\s*'([^']+)'/)[1];

                // Convert href to .md format
                const mdHref = href.endsWith('.md') ? href : `${href}.md`;
                const absoluteUrl = mdHref.startsWith('http') ? mdHref : `https://reui.io${mdHref}`;

                content += `- [${title}](${absoluteUrl}): ${description}\n`;
              }
            }
            content += '\n';
          }
        });
      }
    }

    // Write to public/llms.txt
    const outputPath = join(process.cwd(), 'public', 'llms.txt');
    await writeFile(outputPath, content, 'utf-8');

    console.log('✅ Successfully generated llms.txt in public folder');
    console.log(`📄 Content length: ${content.length} characters`);
    console.log(`📁 Output path: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating LLMs data:', error.message);
    process.exit(1);
  }
}

// Run the script
generateLLMsData();
