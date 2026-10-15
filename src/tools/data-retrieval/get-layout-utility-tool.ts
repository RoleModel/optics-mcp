/**
 * Get Layout Utility Tool
 * Returns HTML patterns and guidance for Optics layout utilities
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from '../tool.js';
import { components, type Component } from '../../optics-data.js';
import { readToolFile } from '../../_internal/resource-path.js';

/**
 * Extended layout utility information
 */
const LAYOUT_UTILITY_DETAILS: Record<string, {
  whenToUse: string;
  patterns: string[];
  responsiveModifiers?: string[];
}> = {
  stack: {
    whenToUse: 'Use Stack for vertical layouts with consistent spacing between items. Perfect for forms, card content, navigation lists, and any vertical flow of content.',
    patterns: [
      '**Form layout**: Wrap form fields in a stack for consistent vertical spacing',
      '**Card content**: Use inside cards to space out title, description, and actions',
      '**Navigation**: Vertical nav items with consistent gaps',
      '**Article content**: Space out paragraphs and sections'
    ],
    responsiveModifiers: ['op-stack--small', 'op-stack--large']
  },
  cluster: {
    whenToUse: 'Use Cluster for horizontal layouts that wrap naturally. Ideal for tags, buttons, badges, and any group of items that should flow and wrap.',
    patterns: [
      '**Tag groups**: Display multiple tags that wrap to new lines',
      '**Button groups**: Group related actions horizontally',
      '**Badge collections**: Show multiple badges inline',
      '**Filter chips**: Wrap filter options naturally'
    ],
    responsiveModifiers: ['op-cluster--small', 'op-cluster--large']
  },
  split: {
    whenToUse: 'Use Split for two-column layouts where content is pushed to opposite ends. Perfect for headers, footers, and any "left vs right" arrangement.',
    patterns: [
      '**Header layout**: Logo on left, navigation on right',
      '**Card footer**: Metadata on left, actions on right',
      '**List items**: Label on left, value on right',
      '**Toolbar**: Title on left, buttons on right'
    ],
    responsiveModifiers: []
  },
  sidebar: {
    whenToUse: 'Use Sidebar for layouts with a fixed-width sidebar and flexible main content area.',
    patterns: [
      '**Dashboard layout**: Navigation sidebar with main content',
      '**Settings page**: Menu sidebar with settings panels',
      '**Documentation**: Table of contents with content area'
    ],
    responsiveModifiers: ['op-sidebar--right']
  },
  grid: {
    whenToUse: 'Use Grid for multi-column layouts with equal-width columns. Great for card grids, galleries, and dashboard widgets.',
    patterns: [
      '**Card grid**: Display cards in responsive columns',
      '**Image gallery**: Equal-sized image thumbnails',
      '**Dashboard widgets**: Arrange dashboard panels',
      '**Product listing**: E-commerce product grid'
    ],
    responsiveModifiers: ['op-grid--2', 'op-grid--3', 'op-grid--4']
  }
};

class GetLayoutUtilityTool extends Tool {
  name = 'get_layout_utility';
  title = 'Get Layout Utility';
  description = 'Get HTML patterns and usage guidance for Optics layout utilities (Stack, Cluster, Split, Sidebar, Grid)';

  inputSchema = {
    utilityType: z.string().describe('Type of layout utility: "stack", "cluster", "split", "sidebar", or "grid"'),
  };

  async handler(args: ToolInputSchema): Promise<string> {
    const { utilityType } = args;
    const result = await this.getLayoutUtility(utilityType.toLowerCase());

    return result;
  }

  /**
   * Get layout utility details
   */
  private async getLayoutUtility(utilityType: string): Promise<string> {
    // Find the layout component in optics-data
    const layoutComponent = components.find(
      c => c.type === 'layout' && c.name.toLowerCase() === utilityType.toLowerCase()
    );

    // Get extended details
    const details = LAYOUT_UTILITY_DETAILS[utilityType];

    if (!layoutComponent && !details) {
      const availableLayouts = Object.keys(LAYOUT_UTILITY_DETAILS).join(', ');
      return `# Layout Utility Not Found\n\nUtility "${utilityType}" not found.\n\nAvailable layout utilities: ${availableLayouts}\n\nUse one of these utility types to get detailed information.`;
    }

    const template = await readToolFile('get-layout-utility-result.md');

    // Build patterns text
    const patternsText = details?.patterns
      ? details.patterns.map(p => `- ${p}`).join('\n')
      : 'No specific patterns documented.';

    // Build example HTML with more detail
    let exampleHtml = layoutComponent?.exampleHtml || `<div class="op-${utilityType}">...</div>`;
    
    // Enhance example HTML based on utility type
    exampleHtml = this.getEnhancedExample(utilityType, exampleHtml);

    return template
      .replace('{{utilityName}}', this.capitalize(utilityType))
      .replace('{{exampleHtml}}', exampleHtml)
      .replace('{{className}}', layoutComponent?.className || `op-${utilityType}`)
      .replace('{{description}}', layoutComponent?.description || `Layout utility: op-${utilityType}`)
      .replace('{{whenToUse}}', details?.whenToUse || 'Use for layout purposes.')
      .replace('{{patterns}}', patternsText)
      .replace('{{docsUrl}}', layoutComponent?.docsUrl || `https://docs.optics.rolemodel.design/?path=/docs/layout-${utilityType}--docs`);
  }

  /**
   * Get enhanced example HTML for each utility type
   */
  private getEnhancedExample(utilityType: string, baseExample: string): string {
    const examples: Record<string, string> = {
      stack: `<!-- Vertical stack with consistent spacing -->
<div class="op-stack">
  <div>First item</div>
  <div>Second item</div>
  <div>Third item</div>
</div>

<!-- Stack with custom gap using CSS variable -->
<div class="op-stack" style="--op-stack-gap: var(--op-spacing-lg)">
  <h2>Title</h2>
  <p>Description text</p>
  <button class="btn">Action</button>
</div>`,

      cluster: `<!-- Horizontal cluster that wraps -->
<div class="op-cluster">
  <span class="badge">Tag 1</span>
  <span class="badge">Tag 2</span>
  <span class="badge">Tag 3</span>
</div>

<!-- Button cluster -->
<div class="op-cluster">
  <button class="btn btn--primary">Save</button>
  <button class="btn btn--ghost">Cancel</button>
</div>`,

      split: `<!-- Split layout: content on opposite ends -->
<div class="op-split">
  <div>Left content (logo, title)</div>
  <div>Right content (actions, nav)</div>
</div>

<!-- Card footer with split -->
<footer class="op-split">
  <span class="text-muted">Last updated: Today</span>
  <button class="btn btn--small">Edit</button>
</footer>`,

      sidebar: `<!-- Sidebar layout -->
<div class="op-sidebar">
  <aside>
    <!-- Sidebar content (nav, filters) -->
    <nav>...</nav>
  </aside>
  <main>
    <!-- Main content area -->
    <article>...</article>
  </main>
</div>`,

      grid: `<!-- Responsive grid -->
<div class="op-grid">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
  <div class="card">Card 4</div>
</div>`
    };

    return examples[utilityType] || baseExample;
  }

  /**
   * Capitalize first letter
   */
  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export default GetLayoutUtilityTool;
