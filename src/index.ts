#!/usr/bin/env node

// @ts-nocheck - Disable type checking due to MCP SDK deep type instantiation issues

/**
 * Optics MCP Server
 * Provides tools and resources for understanding the Optics Design System
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  designTokens,
  components,
  documentation,
  getTokenUsageStats,
  getComponentTokenDependencies,
} from './optics-data.js';
import { generateTheme } from './tools/theme-generator.js';
import { validateTokenUsage, formatValidationReport } from './tools/validate.js';
import { replaceHardCodedValues, formatReplacementSuggestions } from './tools/replace.js';
import { checkTokenContrast, formatContrastResult } from './tools/accessibility.js';
import { suggestTokenMigration, formatMigrationSuggestions } from './tools/migration.js';
import { generateComponentScaffold, formatScaffoldOutput } from './tools/scaffold.js';
import { generateStickerSheet, formatStickerSheet } from './tools/sticker-sheet.js';

/**
 * Create and configure the MCP server
 */
const server = new McpServer({
  name: 'optics-mcp',
  version: '0.1.0',
});

/**
 * Resource: System Overview
 */
server.registerResource(
  'system-overview',
  'optics://system-overview',
  {
    title: 'System Overview - READ THIS FIRST',
    description: 'CRITICAL: Comprehensive guide to understanding the Optics token architecture.',
    mimeType: 'text/plain',
  },
  async () => ({
    contents: [
      {
        uri: 'optics://system-overview',
        mimeType: 'text/plain',
        text: `# Optics Design System - AI Comprehension Guide

**CRITICAL: Read this FIRST before using any Optics tools or data.**

This document explains the Optics Design System architecture in a way that AI agents can understand and use correctly.

## 🎯 The Core Problem

Most design systems use simple tokens like \`--color-primary: #0066CC\`. **Optics does NOT work this way.**

Optics uses a sophisticated HSL-based color system that generates colors dynamically from base values. This means:

❌ **WRONG**: Looking for \`--color-primary\` or \`--op-color-primary\`
✅ **CORRECT**: Using \`--op-color-primary-base\` or the HSL components \`--op-color-primary-h/s/l\`

## 🏗️ Token Architecture

### Layer 1: HSL Base Values (Foundation)

These are the foundational tokens that define color hue, saturation, and lightness:

\`\`\`css
/* Primary color base HSL values */
--op-color-primary-h: 216;      /* Hue */
--op-color-primary-s: 58%;      /* Saturation */
--op-color-primary-l: 48%;      /* Lightness */
\`\`\`

**Color families available:**
- \`primary\` - Main brand color
- \`neutral\` - Grays and neutrals
- \`alerts-warning\` - Yellow/orange warnings
- \`alerts-danger\` - Red errors
- \`alerts-info\` - Blue information
- \`alerts-notice\` - Green success

### Layer 2: Scale Tokens (Light/Dark Adaptive)

From the base HSL values, Optics generates a scale of colors using the \`light-dark()\` CSS function:

**The Scale:**
\`\`\`
plus-max    (lightest - light mode: 100%, dark mode: 12%)
plus-eight
plus-seven
plus-six
plus-five
plus-four
plus-three
plus-two
plus-one
base        (middle - the main color)
minus-one
minus-two
minus-three
minus-four
minus-five
minus-six
minus-seven
minus-eight
minus-max   (darkest - light mode: 0%, dark mode: 100%)
\`\`\`

**Example tokens:**
\`\`\`css
--op-color-primary-base
--op-color-primary-plus-five
--op-color-primary-minus-three
--op-color-neutral-plus-eight
--op-color-alerts-danger-base
\`\`\`

### Layer 3: "On" Tokens (Text Colors)

For each scale token, there's a corresponding "on" token for text that appears ON that background:

\`\`\`css
/* For backgrounds */
--op-color-primary-base
--op-color-primary-plus-five

/* For text ON those backgrounds */
--op-color-primary-on-base
--op-color-primary-on-plus-five
\`\`\`

Each "on" token also has an \`-alt\` variant for secondary text:
\`\`\`css
--op-color-primary-on-base
--op-color-primary-on-base-alt
\`\`\`

## 🎨 How to Use Color Tokens

### ❌ WRONG - Don't Look For These:
\`\`\`css
--color-primary
--op-color-primary
--color-text-primary
\`\`\`

### ✅ CORRECT - Use These Instead:

**For backgrounds:**
\`\`\`css
background: var(--op-color-primary-base);           /* Main primary color */
background: var(--op-color-primary-plus-five);      /* Lighter primary */
background: var(--op-color-neutral-plus-eight);     /* Light gray background */
\`\`\`

**For text:**
\`\`\`css
color: var(--op-color-primary-on-base);             /* Text on primary-base */
color: var(--op-color-neutral-on-plus-eight);       /* Text on light gray */
\`\`\`

**For borders:**
\`\`\`css
border-color: var(--op-color-neutral-plus-four);    /* Light border */
\`\`\`

## 🚨 Common Mistakes

### Mistake 1: Looking for Simple Color Names
❌ Searching for "color-primary"
✅ Search for "primary-base" or "primary" and filter results

### Mistake 2: Ignoring the HSL System
❌ Treating colors as hex values
✅ Understanding that colors are built from HSL components

### Mistake 3: Using Wrong Token Names
❌ \`var(--color-primary)\`
✅ \`var(--op-color-primary-base)\`

### Mistake 4: Not Using \"On\" Tokens for Text
❌ Using arbitrary text colors on colored backgrounds
✅ Using the matching \`-on-\` token: \`--op-color-primary-on-base\` on \`--op-color-primary-base\`

### Mistake 5: Inventing Component Classes
❌ Making up classes like \`.button-primary\`, \`.op-button\`, \`.card-primary\`
✅ Use ONLY the actual Optics component HTML/CSS from https://docs.optics.rolemodel.design
✅ Optics components have specific HTML structure - don't invent your own

## 🎯 Quick Reference

### Most Common Tokens

**Backgrounds:**
- \`--op-color-neutral-plus-eight\` - Light background
- \`--op-color-primary-base\` - Primary button background
- \`--op-color-alerts-danger-base\` - Error state background

**Text:**
- \`--op-color-neutral-on-plus-eight\` - Text on light backgrounds
- \`--op-color-primary-on-base\` - Text on primary backgrounds

**Spacing:**
- \`--op-space-x-small\` (8px) - Tight spacing
- \`--op-space-medium\` (16px) - Standard spacing
- \`--op-space-large\` (20px) - Loose spacing

**Typography:**
- \`--op-font-medium\` (16px) - Body text
- \`--op-font-weight-normal\` (400) - Regular weight
- \`--op-line-height-base\` (1.5) - Body line height

**Borders:**
- \`--op-radius-medium\` (4px) - Standard border radius
- \`--op-border-width\` (1px) - Standard border

## 🎓 Mental Model Summary

Think of Optics tokens like this:

\`\`\`
HSL Base Values (h/s/l)
    ↓
Scale Tokens (plus-max to minus-max)
    ↓
On Tokens (text colors for those scales)
\`\`\`

The system is:
- **Predictable**: Every color family follows the same pattern
- **Adaptive**: Light/dark modes handled automatically
- **Accessible**: On tokens ensure proper contrast
- **Themeable**: Change base HSL values to create themes

**Always use the full token names with \`--op-\` prefix and the correct scale suffix.**`,
      },
    ],
  })
);

/**
 * Resource: Documentation (template-based for all sections)
 */
server.registerResource(
  'documentation',
  'optics://documentation/{section}',
  {
    title: 'Optics Documentation',
    description: 'Documentation sections for the Optics design system',
    mimeType: 'text/plain',
  },
  async (uri) => {
    const section = uri.pathname.replace('/documentation/', '').replace('/', '');
    const doc = documentation.find((d) => d.section === section);

    if (!doc) {
      throw new Error(`Documentation section not found: ${section}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'text/plain',
          text: `# ${doc.title}\n\n${doc.content}${doc.tokens && doc.tokens.length > 0
            ? `\n\nRelated tokens: ${doc.tokens.join(', ')}`
            : ''
            }`,
        },
      ],
    };
  }
);

/**
 * Resource: All Design Tokens
 */
server.registerResource(
  'tokens-all',
  'optics://tokens/all',
  {
    title: 'All Design Tokens',
    description: 'Complete list of all Optics design tokens',
    mimeType: 'application/json',
  },
  async () => ({
    contents: [
      {
        uri: 'optics://tokens/all',
        mimeType: 'application/json',
        text: JSON.stringify(designTokens, null, 2),
      },
    ],
  })
);

/**
 * Resource: Tokens by category (template-based)
 */
server.registerResource(
  'tokens-category',
  'optics://tokens/{category}',
  {
    title: 'Tokens by Category',
    description: 'Design tokens filtered by category (color, spacing, typography, border, shadow)',
    mimeType: 'application/json',
  },
  async (uri) => {
    const category = uri.pathname.replace('/tokens/', '').replace('/', '');

    if (category === 'all') {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(designTokens, null, 2),
          },
        ],
      };
    }

    const filteredTokens = designTokens.filter((t) => t.category === category);
    if (filteredTokens.length === 0) {
      throw new Error(`No tokens found for category: ${category}`);
    }

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify(filteredTokens, null, 2),
        },
      ],
    };
  }
);

/**
 * Resource: All Components
 */
server.registerResource(
  'components-all',
  'optics://components/all',
  {
    title: 'All Components',
    description: 'Complete Optics component library',
    mimeType: 'application/json',
  },
  async () => ({
    contents: [
      {
        uri: 'optics://components/all',
        mimeType: 'application/json',
        text: JSON.stringify(components, null, 2),
      },
    ],
  })
);

/**
 * Prompt: Create Themed Component
 */
server.registerPrompt(
  'create-themed-component',
  {
    title: 'Create Themed Component',
    description: 'Generate a component styled with Optics design tokens',
    argsSchema: {
      componentType: z.string().describe('Type of component (button, card, form, alert, etc.)'),
      variant: z.string().optional().describe('Component variant (primary, secondary, danger, etc.)'),
      framework: z.string().optional().describe('Framework to use (react, vue, svelte, html)'),
    },
  },
  async ({ componentType, variant, framework }) => {
    const compType = componentType || 'button';
    const compVariant = variant || 'primary';
    const compFramework = framework || 'react';

    const component = components.find(
      (c) => c.name.toLowerCase() === compType.toLowerCase()
    );

    if (!component) {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Create a ${compType} component using Optics design tokens. Available components: ${components.map((c) => c.name).join(', ')}`,
            },
          },
        ],
      };
    }

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a ${compVariant} ${compType} component in ${compFramework} using these Optics design tokens:\n\nRequired tokens:\n${component.tokens.join('\n')}\n\nUsage guidelines:\n${component.usage}${component.examples && component.examples.length > 0 ? '\n\nExample structure:\n' + component.examples[0] : ''}`,
          },
        },
      ],
    };
  }
);

/**
 * Prompt: Migrate to Tokens
 */
server.registerPrompt(
  'migrate-to-tokens',
  {
    title: 'Migrate to Tokens',
    description: 'Convert hard-coded CSS values to Optics design tokens',
    argsSchema: {
      code: z.string().describe('CSS or component code with hard-coded values'),
    },
  },
  async ({ code }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Convert the following code to use Optics design tokens. Replace hard-coded colors, spacing, font sizes, and other values with appropriate tokens from the Optics system:\n\n\`\`\`\n${code || ''}\n\`\`\`\n\nAvailable token categories:\n- Color (op-color-*): HSL-based color system\n- Spacing (op-space-*): rem-based spacing scale\n- Typography (op-font-*, op-line-height-*): Font sizes, weights, line heights\n- Border (op-radius-*, op-border-width-*): Border radius and widths\n- Shadow (op-shadow-*): Elevation shadows\n\nUse the validate_token_usage and replace_hard_coded_values tools to help with the conversion.`,
        },
      },
    ],
  })
);

/**
 * Prompt: Accessible Color Combo
 */
server.registerPrompt(
  'accessible-color-combo',
  {
    title: 'Accessible Color Combo',
    description: 'Suggest accessible foreground/background color token combinations',
    argsSchema: {
      colorFamily: z.string().describe('Color family (primary, neutral, danger, warning, info, notice)'),
      wcagLevel: z.string().optional().describe('WCAG level (AA or AAA)'),
    },
  },
  async ({ colorFamily, wcagLevel }) => {
    const family = colorFamily || 'primary';
    const level = wcagLevel || 'AA';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Suggest accessible color token combinations for the ${family} color family that meet WCAG ${level} standards.\n\nOptics uses a scale-based color system with:\n- Base HSL tokens: --op-color-${family}-h/s/l\n- Generated scale tokens: ${family}-base, ${family}-plus-one through plus-eight, ${family}-minus-one through minus-eight\n- On-color tokens for text: ${family}-on-base, ${family}-on-plus-five, etc.\n\nUse the check_contrast tool to validate combinations. Suggest foreground/background pairs that meet the contrast requirements.`,
          },
        },
      ],
    };
  }
);

/**
 * Prompt: Explain Token System
 */
server.registerPrompt(
  'explain-token-system',
  {
    title: 'Explain Token System',
    description: 'Explain how a specific token category works in Optics',
    argsSchema: {
      category: z.string().describe('Token category (color, spacing, typography, border, shadow)'),
    },
  },
  async ({ category }) => {
    const cat = category || 'color';
    const tokens = designTokens.filter((t) => t.category === cat);

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Explain how the ${cat} token system works in Optics.\n\nAvailable ${cat} tokens (${tokens.length} total):\n${tokens.slice(0, 10).map((t) => `- ${t.name}: ${t.description}`).join('\n')}${tokens.length > 10 ? '\n... and ' + (tokens.length - 10) + ' more' : ''}\n\nInclude:\n1. How to use these tokens\n2. When to use each one\n3. Best practices\n4. Common patterns`,
          },
        },
      ],
    };
  }
);

/**
 * Prompt: Design Review
 */
server.registerPrompt(
  'design-review',
  {
    title: 'Design Review',
    description: 'Review a design or component for Optics token usage and best practices',
    argsSchema: {
      code: z.string().describe('Component code to review'),
      componentType: z.string().optional().describe('Type of component being reviewed'),
    },
  },
  async ({ code, componentType }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Review this ${componentType || 'unknown'} component for Optics design system compliance:\n\n\`\`\`\n${code || ''}\n\`\`\`\n\nCheck for:\n1. Hard-coded values that should use tokens\n2. Proper token usage and naming\n3. Accessibility (color contrast, focus states)\n4. Consistency with Optics patterns\n5. Missing or incorrect tokens\n\nUse these tools to help:\n- validate_token_usage: Find hard-coded values\n- check_contrast: Verify color accessibility\n- get_component_info: See how Optics components use tokens`,
        },
      },
    ],
  })
);

/**
 * Prompt: Get Token Reference
 */
server.registerPrompt(
  'get-token-reference',
  {
    title: 'Get Token Reference',
    description: 'Get complete list of all available Optics design tokens - USE THIS to prevent token name hallucination',
    argsSchema: {
      category: z.string().optional().describe('Optional: Filter by category (spacing, typography, border, shadow, or leave empty for all)'),
    },
  },
  async ({ category }) => {
    let tokens = designTokens;

    if (category) {
      tokens = designTokens.filter((t) => t.category === category);
    }

    // Group non-color tokens for clarity
    const spacing = tokens.filter(t => t.category === 'spacing');
    const typography = tokens.filter(t => t.category === 'typography');
    const border = tokens.filter(t => t.category === 'border');
    const shadow = tokens.filter(t => t.category === 'shadow');

    let message = `# Complete Optics Design Token Reference\n\n**IMPORTANT: These are the ONLY valid token names. Do not invent token names like --op-space-600 or use hard-coded pixel values.**\n\n`;

    if (!category || category === 'spacing') {
      message += `## Spacing Tokens (${spacing.length} tokens)\n\n`;
      message += `**ONLY use these exact names:**\n\n`;
      spacing.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n**Examples:**\n`;
      message += `- padding: var(--op-space-medium); /* 16px */\n`;
      message += `- margin: var(--op-space-large); /* 20px */\n`;
      message += `- gap: var(--op-space-x-small); /* 8px */\n\n`;
    }

    if (!category || category === 'typography') {
      message += `## Typography Tokens (${typography.length} tokens)\n\n`;
      const fontSizes = typography.filter(t => t.name.includes('font-') && !t.name.includes('weight') && !t.name.includes('family'));
      const fontWeights = typography.filter(t => t.name.includes('weight'));
      const lineHeights = typography.filter(t => t.name.includes('line-height'));

      message += `### Font Sizes (${fontSizes.length}):\n`;
      fontSizes.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });

      message += `\n### Font Weights (${fontWeights.length}):\n`;
      fontWeights.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });

      message += `\n### Line Heights (${lineHeights.length}):\n`;
      lineHeights.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n`;
    }

    if (!category || category === 'border') {
      message += `## Border Tokens (${border.length} tokens)\n\n`;
      border.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n`;
    }

    if (!category || category === 'shadow') {
      message += `## Shadow Tokens (${shadow.length} tokens)\n\n`;
      shadow.forEach(t => {
        message += `- \`${t.name}\`\n`;
      });
      message += `\n`;
    }

    message += `\n---\n\n**CRITICAL RULES:**\n`;
    message += `1. NEVER invent token names - only use names from this list\n`;
    message += `2. NEVER use hard-coded px values - always use tokens\n`;
    message += `3. For colors, use search_tokens tool to find available color tokens\n`;
    message += `4. Token names use words like 'small', 'medium', 'large', NOT numbers like '600'\n`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: message,
          },
        },
      ],
    };
  }
);


/**
 * Tool: Get Token
 */
server.registerTool(
  'get_token',
  {
    title: 'Get Token',
    description: 'Get detailed information about a specific design token by name',
    inputSchema: {
      tokenName: z.string().describe('The name of the design token (e.g., "color-primary", "spacing-md")'),
    },
  },
  async ({ tokenName }) => {
    const token = designTokens.find((t) => t.name === tokenName);

    if (!token) {
      return {
        content: [
          {
            type: 'text',
            text: `Token not found: ${tokenName}\n\nAvailable tokens: ${designTokens
              .map((t) => t.name)
              .join(', ')}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(token, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Search Tokens
 */
server.registerTool(
  'search_tokens',
  {
    title: 'Search Tokens',
    description: 'Search for design tokens by category or name pattern',
    inputSchema: {
      category: z.string().optional().describe('Filter by category (color, spacing, typography, border, shadow)'),
      namePattern: z.string().optional().describe('Search pattern for token names (case-insensitive)'),
    },
  },
  async ({ category, namePattern }) => {
    let filtered = designTokens;

    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (namePattern) {
      const pattern = namePattern.toLowerCase();
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(pattern)
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(filtered, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Token Usage Stats
 */
server.registerTool(
  'get_token_usage_stats',
  {
    title: 'Get Token Usage Stats',
    description: 'Get statistics about design token usage across the system',
    inputSchema: {},
  },
  async () => {
    const stats = getTokenUsageStats();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Component Info
 */
server.registerTool(
  'get_component_info',
  {
    title: 'Get Component Info',
    description: 'Get detailed information about a component including its design token dependencies',
    inputSchema: {
      componentName: z.string().describe('The name of the component (e.g., "Button", "Card", "Input")'),
    },
  },
  async ({ componentName }) => {
    const component = components.find(
      (c) => c.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!component) {
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: ${componentName}\n\nAvailable components: ${components
              .map((c) => c.name)
              .join(', ')}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(component, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: List Components
 */
server.registerTool(
  'list_components',
  {
    title: 'List Components',
    description: 'List all available components in the design system',
    inputSchema: {},
  },
  async () => {
    const componentList = components.map((c) => ({
      name: c.name,
      description: c.description,
      tokenCount: c.tokens.length,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(componentList, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Component Tokens
 */
server.registerTool(
  'get_component_tokens',
  {
    title: 'Get Component Tokens',
    description: 'Get all design tokens used by a specific component',
    inputSchema: {
      componentName: z.string().describe('The name of the component'),
    },
  },
  async ({ componentName }) => {
    const deps = getComponentTokenDependencies(componentName);

    if (!deps) {
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: ${componentName}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(deps, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Search Documentation
 */
server.registerTool(
  'search_documentation',
  {
    title: 'Search Documentation',
    description: 'Search through Optics documentation',
    inputSchema: {
      query: z.string().describe('Search query for documentation content'),
    },
  },
  async ({ query }) => {
    const results = documentation.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase()) ||
        doc.section.toLowerCase().includes(query.toLowerCase())
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Generate Theme
 */
server.registerTool(
  'generate_theme',
  {
    title: 'Generate Theme',
    description: 'Generate a custom Optics theme with CSS variable overrides',
    inputSchema: {
      brandName: z.string().describe('Name of the brand/theme (e.g., "Acme Corp")'),
      primary: z.string().describe('Primary brand color (hex, e.g., "#0066CC")'),
      secondary: z.string().optional().describe('Secondary color (hex, optional)'),
    },
  },
  async ({ brandName, primary, secondary }) => {
    const brandColors = {
      primary,
      secondary,
    };

    const theme = generateTheme(brandName, brandColors);

    return {
      content: [
        {
          type: 'text',
          text: `# ${brandName} Theme Generated\n\n## CSS Variables\n\n\`\`\`css\n${theme.cssVariables}\n\`\`\`\n\n## Figma Variables\n\nSave this as \`figma-variables.json\`:\n\n\`\`\`json\n${theme.figmaVariables}\n\`\`\`\n\n## Summary\n\n- **Total tokens**: ${theme.tokens.length}\n- **Colors**: ${theme.tokens.filter(t => t.category === 'color').length}\n- **Typography**: ${theme.tokens.filter(t => t.category === 'typography').length}\n- **Spacing**: ${theme.tokens.filter(t => t.category === 'spacing').length}\n\n${theme.documentation}`,
        },
      ],
    };
  }
);

/**
 * Tool: Validate Token Usage
 */
server.registerTool(
  'validate_token_usage',
  {
    title: 'Validate Token Usage',
    description: 'Validate code for hard-coded values that should use design tokens',
    inputSchema: {
      code: z.string().describe('CSS or component code to validate'),
    },
  },
  async ({ code }) => {
    const report = validateTokenUsage(code, designTokens);
    const formatted = formatValidationReport(report);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Replace Hard-Coded Values
 */
server.registerTool(
  'replace_hard_coded_values',
  {
    title: 'Replace Hard-Coded Values',
    description: 'Replace hard-coded values with design tokens',
    inputSchema: {
      code: z.string().describe('Code containing hard-coded values'),
      autofix: z.boolean().optional().describe('Whether to automatically fix the code (default: false)'),
    },
  },
  async ({ code, autofix }) => {
    const result = replaceHardCodedValues(code, designTokens, autofix ?? false);
    const formatted = formatReplacementSuggestions(result);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Check Contrast
 */
server.registerTool(
  'check_contrast',
  {
    title: 'Check Contrast',
    description: 'Check WCAG contrast ratio between two color tokens',
    inputSchema: {
      foregroundToken: z.string().describe('Foreground color token name'),
      backgroundToken: z.string().describe('Background color token name'),
    },
  },
  async ({ foregroundToken, backgroundToken }) => {
    const result = checkTokenContrast(foregroundToken, backgroundToken, designTokens);
    const formatted = formatContrastResult(result);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Suggest Token Migration
 */
server.registerTool(
  'suggest_token_migration',
  {
    title: 'Suggest Token Migration',
    description: 'Suggest design tokens for a hard-coded value',
    inputSchema: {
      value: z.string().describe('Hard-coded value to find tokens for (e.g., "#0066CC", "16px")'),
      category: z.string().optional().describe('Optional category filter (color, spacing, typography)'),
    },
  },
  async ({ value, category }) => {
    const suggestion = suggestTokenMigration(value, designTokens, category);
    const formatted = formatMigrationSuggestions(suggestion);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Generate Component Scaffold
 */
server.registerTool(
  'generate_component_scaffold',
  {
    title: 'Generate Component Scaffold',
    description: 'Generate a React component scaffold with proper token usage',
    inputSchema: {
      componentName: z.string().describe('Name of the component (e.g., "Alert", "Card")'),
      description: z.string().describe('Brief description of the component'),
      tokens: z.array(z.string()).describe('List of token names the component should use'),
    },
  },
  async ({ componentName, description, tokens }) => {
    const scaffold = generateComponentScaffold(
      componentName,
      description,
      tokens,
      designTokens
    );
    const formatted = formatScaffoldOutput(scaffold);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Generate Sticker Sheet
 */
server.registerTool(
  'generate_sticker_sheet',
  {
    title: 'Generate Sticker Sheet',
    description: 'Generate a visual style guide with color swatches and component examples',
    inputSchema: {
      framework: z.enum(['react', 'vue', 'svelte', 'html']).optional().describe('Target framework (default: react)'),
      includeColors: z.boolean().optional().describe('Include color swatches (default: true)'),
      includeTypography: z.boolean().optional().describe('Include typography specimens (default: true)'),
      includeComponents: z.boolean().optional().describe('Include component examples (default: true)'),
    },
  },
  async ({ framework, includeColors, includeTypography, includeComponents }) => {
    const options = {
      framework: framework ?? 'react',
      includeColors: includeColors ?? true,
      includeTypography: includeTypography ?? true,
      includeComponents: includeComponents ?? true,
    };
    const sheet = generateStickerSheet(designTokens, components, options);
    const formatted = formatStickerSheet(sheet);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);


/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Optics MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
