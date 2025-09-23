import { allDocs } from 'contentlayer/generated';

/**
 * Convert MDX content to clean markdown
 */
export function convertMdxToMarkdown(content: string): string {
  let markdown = content;

  // Remove MDX-specific components and convert to markdown equivalents
  markdown = markdown
    // Convert <Alert> components to markdown blockquotes
    .replace(/<Alert[^>]*variant="([^"]*)"[^>]*>([\s\S]*?)<\/Alert>/g, (match, variant, content) => {
      const alertType = variant === 'destructive' ? '> ⚠️' : variant === 'success' ? '> ✅' : '> ℹ️';
      return `${alertType} ${content.replace(/<[^>]*>/g, '').trim()}\n`;
    })
    // Convert <Steps> to numbered list
    .replace(/<Steps>([\s\S]*?)<\/Steps>/g, (match, content) => {
      const steps = content.split(/###/).filter(Boolean);
      return steps.map((step: string, index: number) => `### ${index + 1}. ${step.trim()}`).join('\n\n');
    })
    // Convert <AlertIcon> and <AlertTitle> to simple text
    .replace(/<AlertIcon>[\s\S]*?<\/AlertIcon>/g, '')
    .replace(/<AlertTitle>([\s\S]*?)<\/AlertTitle>/g, '**$1**')
    // Convert code blocks with language specification
    .replace(/```(\w+)\s+showLineNumbers/g, '```$1')
    // Remove any remaining JSX components
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();

  return markdown;
}

/**
 * Get document by slug and convert to markdown
 */
export function getDocumentAsMarkdown(slugPath: string) {
  const doc = allDocs.find((doc) => {
    const normalizedSlug = doc.slugAsParams.replace(/\(.*?\)\//g, '');
    return normalizedSlug === slugPath;
  });

  if (!doc) {
    return null;
  }

  const markdownContent = convertMdxToMarkdown(doc.body.raw);

  const frontmatter = `---
title: "${doc.title}"
description: "${doc.description}"
published: ${doc.published}
featured: ${doc.featured}
component: ${doc.component}
toc: ${doc.toc}
slug: "${doc.slug}"
---

`;

  return frontmatter + markdownContent;
}
