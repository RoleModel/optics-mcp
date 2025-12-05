/**
 * Theme generator tool
 * Generates complete theme with CSS variables and Figma Variables JSON
 * Uses actual Optics tokens, only customizing HSL color base values
 */

import { DesignToken, designTokens } from '../optics-data.js';
import { generateFigmaVariablesJSON } from '../utils/figma-tokens.js';

/**
 * Optics color families that can be themed
 * Each accepts a hex color that will be converted to HSL base values
 */
export interface BrandColors {
  primary?: string;        // Main brand color (hex) - converted to --op-color-primary-h/s/l
  neutral?: string;        // Neutral/gray color (hex) - converted to --op-color-neutral-h/s/l  
  'alerts-warning'?: string;  // Warning color (hex)
  'alerts-danger'?: string;   // Error color (hex)
  'alerts-info'?: string;     // Info color (hex)
  'alerts-notice'?: string;   // Success color (hex)
}

export interface ThemeOptions {
  includeDarkMode?: boolean;
  includeSemanticColors?: boolean;
  includeTypography?: boolean;
  includeSpacing?: boolean;
  includeBorders?: boolean;
  includeShadows?: boolean;
}

export interface GeneratedTheme {
  cssVariables: string;
  figmaVariables: string;
  tokens: DesignToken[];
  documentation: string;
}

/**
 * Generate spacing tokens using base-8 system
 */
function generateSpacingTokens(): DesignToken[] {
  const spacingScale = [
    { name: 'xs', value: '4px' },
    { name: 'sm', value: '8px' },
    { name: 'md', value: '16px' },
    { name: 'lg', value: '24px' },
    { name: 'xl', value: '32px' },
    { name: '2xl', value: '48px' }
  ];
  
  return spacingScale.map(({ name, value }) => ({
    name: `spacing-${name}`,
    value,
    category: 'spacing',
    description: `Spacing ${name} - ${value}`
  }));
}

/**
 * Generate typography tokens
 */
function generateTypographyTokens(): DesignToken[] {
  return [
    {
      name: 'font-family-base',
      value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      category: 'typography',
      description: 'Base font family for body text'
    },
    {
      name: 'font-family-heading',
      value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      category: 'typography',
      description: 'Font family for headings'
    },
    {
      name: 'font-family-mono',
      value: '"SF Mono", "Monaco", "Consolas", monospace',
      category: 'typography',
      description: 'Monospace font family for code'
    },
    { name: 'font-size-xs', value: '12px', category: 'typography', description: 'Extra small font size' },
    { name: 'font-size-sm', value: '14px', category: 'typography', description: 'Small font size' },
    { name: 'font-size-md', value: '16px', category: 'typography', description: 'Medium font size (base)' },
    { name: 'font-size-lg', value: '18px', category: 'typography', description: 'Large font size' },
    { name: 'font-size-xl', value: '20px', category: 'typography', description: 'Extra large font size' },
    { name: 'font-size-2xl', value: '24px', category: 'typography', description: '2X large font size' },
    { name: 'font-size-3xl', value: '32px', category: 'typography', description: '3X large font size' },
    { name: 'font-weight-normal', value: '400', category: 'typography', description: 'Normal font weight' },
    { name: 'font-weight-medium', value: '500', category: 'typography', description: 'Medium font weight' },
    { name: 'font-weight-semibold', value: '600', category: 'typography', description: 'Semibold font weight' },
    { name: 'font-weight-bold', value: '700', category: 'typography', description: 'Bold font weight' },
    { name: 'line-height-tight', value: '1.25', category: 'typography', description: 'Tight line height for headings' },
    { name: 'line-height-normal', value: '1.5', category: 'typography', description: 'Normal line height for body text' },
    { name: 'line-height-relaxed', value: '1.75', category: 'typography', description: 'Relaxed line height for long-form content' }
  ];
}

/**
 * Generate border tokens
 */
function generateBorderTokens(): DesignToken[] {
  return [
    { name: 'border-radius-sm', value: '4px', category: 'border', description: 'Small border radius' },
    { name: 'border-radius-md', value: '8px', category: 'border', description: 'Medium border radius' },
    { name: 'border-radius-lg', value: '12px', category: 'border', description: 'Large border radius' },
    { name: 'border-radius-full', value: '9999px', category: 'border', description: 'Full border radius for circular elements' }
  ];
}

/**
 * Generate shadow tokens
 */
function generateShadowTokens(): DesignToken[] {
  return [
    { name: 'shadow-sm', value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', category: 'shadow', description: 'Small shadow for subtle elevation' },
    { name: 'shadow-md', value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', category: 'shadow', description: 'Medium shadow for cards and panels' },
    { name: 'shadow-lg', value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', category: 'shadow', description: 'Large shadow for modals and popovers' }
  ];
}

/**
 * Generate Optics HSL color tokens from brand colors
 * Each color family gets h/s/l base values that drive the scale system
 */
function generateColorTokens(brandColors: BrandColors): DesignToken[] {
  const tokens: DesignToken[] = [];
  
  // Default Optics colors if not provided
  const defaults: BrandColors = {
    primary: '#2D6FDB',      // Optics default primary
    neutral: '#757882',      // Optics default neutral
    'alerts-warning': '#FFD93D',
    'alerts-danger': '#FF6B94',
    'alerts-info': '#2D6FDB',
    'alerts-notice': '#6ACF71'
  };
  
  const colors = { ...defaults, ...brandColors };
  
  // Generate HSL base values for each color family
  for (const [family, hex] of Object.entries(colors)) {
    if (!hex) continue;
    
    const hsl = hexToHSL(hex);
    const familyName = family === 'primary' || family === 'neutral' ? family : family;
    
    tokens.push({
      name: `op-color-${familyName}-h`,
      value: String(hsl.h),
      category: 'color',
      description: `${familyName} color hue (HSL) - drives all ${familyName} scale tokens`
    });
    
    tokens.push({
      name: `op-color-${familyName}-s`,
      value: `${hsl.s}%`,
      category: 'color',
      description: `${familyName} color saturation (HSL)`
    });
    
    tokens.push({
      name: `op-color-${familyName}-l`,
      value: `${hsl.l}%`,
      category: 'color',
      description: `${familyName} color lightness (HSL)`
    });
  }
  
  return tokens;
}

/**
 * Convert hex to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB first
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Generate CSS variables from tokens using HSL for colors
 */
function generateCSSVariables(tokens: DesignToken[], themeName: string = 'default'): string {
  const lines: string[] = [
    `/* ${themeName} Theme - Generated by Optics MCP */`,
    `/* HSL tokens for easy theming */`,
    `:root {`
  ];
  
  // Group tokens by category
  const grouped: Record<string, DesignToken[]> = {};
  tokens.forEach(token => {
    if (!grouped[token.category]) grouped[token.category] = [];
    grouped[token.category].push(token);
  });
  
  // Output color tokens - they're already in HSL format
  if (grouped['color']) {
    lines.push(`  /* Colors (HSL) */`);
    for (const token of grouped['color']) {
      // Tokens are already properly formatted (either HSL base values or full color values)
      lines.push(`  --${token.name}: ${token.value};`);
    }
    lines.push('');
  }
  
  // Output non-color tokens normally
  for (const [category, categoryTokens] of Object.entries(grouped)) {
    if (category === 'color') continue; // Already handled
    
    lines.push(`  /* ${category.charAt(0).toUpperCase() + category.slice(1)} */`);
    for (const token of categoryTokens) {
      lines.push(`  --${token.name}: ${token.value};`);
    }
    lines.push('');
  }
  
  lines.push('}');
  
  return lines.join('\n');
}

/**
 * Generate theme documentation
 */
function generateDocumentation(themeName: string, tokens: DesignToken[]): string {
  const stats = tokens.reduce((acc, token) => {
    acc[token.category] = (acc[token.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const lines: string[] = [
    `# ${themeName} Theme`,
    '',
    '## Overview',
    'This theme was generated by Optics MCP and includes a complete set of design tokens.',
    '',
    '## Token Summary',
    ''
  ];
  
  for (const [category, count] of Object.entries(stats)) {
    lines.push(`- **${category}**: ${count} tokens`);
  }
  
  lines.push('');
  lines.push('## Usage');
  lines.push('');
  lines.push('### CSS Variables');
  lines.push('```css');
  lines.push('/* Use tokens with var() */');
  lines.push('.button {');
  lines.push('  background-color: var(--color-primary);');
  lines.push('  padding: var(--spacing-md);');
  lines.push('  border-radius: var(--border-radius-md);');
  lines.push('}');
  lines.push('```');
  lines.push('');
  lines.push('### Figma Variables');
  lines.push('Import the `figma-variables.json` file into Figma:');
  lines.push('1. Open your Figma file');
  lines.push('2. Go to Variables panel');
  lines.push('3. Import → Select `figma-variables.json`');
  lines.push('');
  lines.push('## Token Categories');
  lines.push('');
  
  // Group tokens by category for documentation
  const grouped: Record<string, DesignToken[]> = {};
  tokens.forEach(token => {
    if (!grouped[token.category]) grouped[token.category] = [];
    grouped[token.category].push(token);
  });
  
  for (const [category, categoryTokens] of Object.entries(grouped)) {
    lines.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    lines.push('');
    lines.push('| Token Name | Value | Description |');
    lines.push('|------------|-------|-------------|');
    for (const token of categoryTokens) {
      lines.push(`| \`${token.name}\` | \`${token.value}\` | ${token.description || ''} |`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Main theme generation function
 * Uses all standard Optics tokens, only customizing the HSL color base values
 */
export function generateTheme(
  brandName: string,
  brandColors: BrandColors,
  options: ThemeOptions = {}
): GeneratedTheme {
  // Start with all standard Optics tokens
  let tokens: DesignToken[] = [...designTokens];
  
  // Override HSL color base values if custom colors provided
  if (Object.keys(brandColors).length > 0) {
    const customColorTokens = generateColorTokens(brandColors);
    
    // Replace the HSL base tokens with custom ones
    tokens = tokens.map(token => {
      const customToken = customColorTokens.find(ct => ct.name === token.name);
      return customToken || token;
    });
  }
  
  const cssVariables = generateCSSVariables(tokens, brandName);
  const figmaVariables = generateFigmaVariablesJSON(tokens, {
    collectionName: `${brandName} Design System`
  });
  const documentation = generateDocumentation(brandName, tokens);
  
  return {
    cssVariables,
    figmaVariables,
    tokens,
    documentation
  };
}
