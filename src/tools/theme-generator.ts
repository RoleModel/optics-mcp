/**
 * Theme generator tool
 * Generates complete theme with CSS variables and Figma Variables JSON
 */

import { DesignToken } from '../optics-data.js';
import { generateFigmaVariablesJSON, createMultiModeVariables } from '../utils/figma-tokens.js';

export interface BrandColors {
  primary: string;
  secondary?: string;
  success?: string;
  danger?: string;
  warning?: string;
  info?: string;
  background?: string;
  surface?: string;
  textPrimary?: string;
  textSecondary?: string;
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
 * Generate color tokens from brand colors
 */
function generateColorTokens(brandColors: BrandColors): DesignToken[] {
  const defaults: BrandColors = {
    primary: '#0066CC',
    secondary: '#6C757D',
    success: '#28A745',
    danger: '#DC3545',
    warning: '#FFC107',
    info: '#17A2B8',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    textPrimary: '#212529',
    textSecondary: '#6C757D'
  };
  
  const colors = { ...defaults, ...brandColors };
  
  return [
    { name: 'color-primary', value: colors.primary, category: 'color', description: 'Primary brand color' },
    { name: 'color-secondary', value: colors.secondary!, category: 'color', description: 'Secondary color' },
    { name: 'color-success', value: colors.success!, category: 'color', description: 'Success state color' },
    { name: 'color-danger', value: colors.danger!, category: 'color', description: 'Danger/error state color' },
    { name: 'color-warning', value: colors.warning!, category: 'color', description: 'Warning state color' },
    { name: 'color-info', value: colors.info!, category: 'color', description: 'Info state color' },
    { name: 'color-background', value: colors.background!, category: 'color', description: 'Default background color' },
    { name: 'color-surface', value: colors.surface!, category: 'color', description: 'Surface color for cards and panels' },
    { name: 'color-text-primary', value: colors.textPrimary!, category: 'color', description: 'Primary text color' },
    { name: 'color-text-secondary', value: colors.textSecondary!, category: 'color', description: 'Secondary text color' }
  ];
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
  
  // Output color tokens as HSL custom properties
  if (grouped['color']) {
    lines.push(`  /* Colors (HSL) */`);
    for (const token of grouped['color']) {
      const hsl = hexToHSL(token.value);
      // Optics format: --op-color-primary-h (not --op-primary-h)
      lines.push(`  --op-${token.name}-h: ${hsl.h};`);
      lines.push(`  --op-${token.name}-s: ${hsl.s}%;`);
      lines.push(`  --op-${token.name}-l: ${hsl.l}%;`);
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
 */
export function generateTheme(
  brandName: string,
  brandColors: BrandColors,
  options: ThemeOptions = {}
): GeneratedTheme {
  const {
    includeSemanticColors = true,
    includeTypography = true,
    includeSpacing = true,
    includeBorders = true,
    includeShadows = true
  } = options;
  
  let tokens: DesignToken[] = [];
  
  // Always include brand colors
  tokens = tokens.concat(generateColorTokens(brandColors));
  
  if (includeSpacing) {
    tokens = tokens.concat(generateSpacingTokens());
  }
  
  if (includeTypography) {
    tokens = tokens.concat(generateTypographyTokens());
  }
  
  if (includeBorders) {
    tokens = tokens.concat(generateBorderTokens());
  }
  
  if (includeShadows) {
    tokens = tokens.concat(generateShadowTokens());
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
