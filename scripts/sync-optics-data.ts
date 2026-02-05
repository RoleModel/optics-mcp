#!/usr/bin/env npx ts-node

/**
 * Sync Optics Data Script
 * Run: npm run sync-data
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const OPTICS_PACKAGE = '@rolemodel/optics';
const OPTICS_SOURCE_REPO = path.join(__dirname, '../../optics'); // Assumes optics repo is sibling
const OUTPUT_FILE = path.join(__dirname, '../src/optics-data.ts');

// Token categories matching Optics Storybook
type TokenCategory =
  | 'animation'
  | 'border'
  | 'breakpoint'
  | 'color'
  | 'encoded-image'
  | 'input'
  | 'opacity'
  | 'shadow'
  | 'sizing'
  | 'spacing'
  | 'typography'
  | 'z-index';

interface DesignToken {
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
}

interface CSSPattern {
  name: string;
  description: string;
  className: string;
  type: 'component' | 'layout' | 'utility';
  modifiers: string[];
  elements: string[];
  exampleHtml: string;
  docsUrl: string;
}

interface Documentation {
  section: string;
  title: string;
  content: string;
  tokens: string[];
}

// ============================================================================
// Find Optics paths
// ============================================================================

function findOpticsPackage(): string | null {
  const possiblePaths = [
    path.join(__dirname, '../node_modules', OPTICS_PACKAGE),
    path.join(__dirname, '../../node_modules', OPTICS_PACKAGE),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  return null;
}

function findOpticsSourceRepo(): string | null {
  if (fs.existsSync(OPTICS_SOURCE_REPO) && fs.existsSync(path.join(OPTICS_SOURCE_REPO, 'src/stories'))) {
    return OPTICS_SOURCE_REPO;
  }
  return null;
}

// ============================================================================
// Token Extraction from tokens.json
// ============================================================================

function flattenTokens(obj: any, prefix: string = ''): DesignToken[] {
  const tokens: DesignToken[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}-${key}` : key;

    if (typeof value === 'string') {
      const category = categorizeToken(name);
      tokens.push({
        name,
        cssVar: `--op-${name}`,
        value,
        category,
        description: generateTokenDescription(name, category),
      });
    } else if (typeof value === 'object' && value !== null) {
      tokens.push(...flattenTokens(value, name));
    }
  }

  return tokens;
}

function categorizeToken(name: string): TokenCategory {
  if (name.includes('z-index') || name.startsWith('z-')) return 'z-index';
  if (name.startsWith('animation-') || name.startsWith('transition-') || name.startsWith('duration-') || name.startsWith('easing-')) return 'animation';
  if (name.startsWith('radius-') || name.startsWith('border-')) return 'border';
  if (name.startsWith('breakpoint-') || name.startsWith('screen-')) return 'breakpoint';
  if (name.startsWith('input-')) return 'input';
  if (name.startsWith('opacity-') || name.includes('-opacity')) return 'opacity';
  if (name.startsWith('shadow-') || name.includes('-shadow')) return 'shadow';
  if (name.startsWith('size-') || name.includes('-width') || name.includes('-height')) return 'sizing';
  if (name.startsWith('space-') || name.startsWith('gap-')) return 'spacing';
  if (name.startsWith('font-') || name.startsWith('line-height') || name.startsWith('letter-') || name.startsWith('text-')) return 'typography';
  if (name.startsWith('encoded-') || name.startsWith('image-')) return 'encoded-image';
  if (name.startsWith('color-') || name.includes('-color-') || name.includes('-on-') || name.includes('-base') || name.includes('-plus-') || name.includes('-minus-')) return 'color';
  return 'sizing';
}

function generateTokenDescription(name: string, category: TokenCategory): string {
  if (category === 'color') {
    if (name.includes('-on-')) {
      const parts = name.split('-on-');
      return `Text color for use ON ${parts[1]} background. MUST be paired with matching background color.`;
    }
    if (name.endsWith('-h')) return `Hue component (HSL) for ${name.replace('-h', '')}`;
    if (name.endsWith('-s')) return `Saturation component (HSL) for ${name.replace('-s', '')}`;
    if (name.endsWith('-l')) return `Lightness component (HSL) for ${name.replace('-l', '')}`;
  }
  return `${category} token: ${name}`;
}

// ============================================================================
// CSS Token Extraction from dist CSS (fallback)
// ============================================================================

function extractTokensFromCSS(cssContent: string): DesignToken[] {
  const tokens: DesignToken[] = [];
  const customPropRegex = /--op-([a-z0-9-]+):\s*([^;]+);/g;
  let match;

  while ((match = customPropRegex.exec(cssContent)) !== null) {
    const name = match[1];
    const value = match[2].trim();
    const category = categorizeToken(name);

    tokens.push({
      name,
      cssVar: `--op-${name}`,
      value,
      category,
      description: generateTokenDescription(name, category),
    });
  }

  return tokens;
}

// ============================================================================
// CSS Class Extraction for validation
// ============================================================================

function extractCSSClasses(cssContent: string): Set<string> {
  const classes = new Set<string>();
  const classRegex = /\.([a-z][a-z0-9_-]*)/g;
  let match;

  while ((match = classRegex.exec(cssContent)) !== null) {
    classes.add(match[1]);
  }

  return classes;
}

// ============================================================================
// Storybook MDX Parsing
// ============================================================================

interface ClassDoc {
  className: string;
  description: string;
  isModifier: boolean;
  baseClass?: string;
}

function parseComponentMdx(mdxPath: string, componentName: string): {
  componentDescription: string;
  classes: ClassDoc[];
} {
  const content = fs.readFileSync(mdxPath, 'utf-8');

  // Extract description (first paragraph after # ComponentName)
  const descMatch = content.match(new RegExp(`# ${componentName}[\\s\\S]*?\\n\\n([^#\\n<][^\\n]+)`));
  const componentDescription = descMatch ? descMatch[1].trim() : '';

  // Extract ALL class documentation: `.class-name` Description text
  const classes: ClassDoc[] = [];
  const classDocRegex = /`\.([a-z][a-z0-9_-]*(?:--[a-z0-9-]+)?)`\s+([^`\n]+)/g;
  let classMatch;

  while ((classMatch = classDocRegex.exec(content)) !== null) {
    const className = classMatch[1];
    const description = classMatch[2].trim();
    const isModifier = className.includes('--');
    const baseClass = isModifier ? className.split('--')[0] : undefined;

    classes.push({ className, description, isModifier, baseClass });
  }

  return { componentDescription, classes };
}

function getBaseClasses(classes: ClassDoc[]): string[] {
  // Get unique base classes (non-modifiers)
  const baseClasses = classes
    .filter(c => !c.isModifier)
    .map(c => c.className);
  return [...new Set(baseClasses)];
}

// ============================================================================
// Storybook Stories Parsing
// ============================================================================

function parseStoriesFile(storiesPath: string): { variants: string[]; sizes: string[] } {
  const content = fs.readFileSync(storiesPath, 'utf-8');

  // Extract variant options
  const variantMatch = content.match(/variant:\s*\{[^}]*options:\s*\[([^\]]+)\]/);
  const variants = variantMatch
    ? variantMatch[1].split(',').map(v => v.trim().replace(/['"]/g, ''))
    : [];

  // Extract size options
  const sizeMatch = content.match(/size:\s*\{[^}]*options:\s*\[([^\]]+)\]/);
  const sizes = sizeMatch
    ? sizeMatch[1].split(',').map(s => s.trim().replace(/['"]/g, ''))
    : [];

  return { variants, sizes };
}

// ============================================================================
// Scrape Components from Storybook Source
// NOTE: Requires the Optics git repo to be cloned at ../../optics
// Storybook files are NOT included in the npm package
// ============================================================================

function scrapeComponentsFromStorybook(sourceRepo: string, opticsPackagePath: string, validClasses: Set<string>): CSSPattern[] {
  const patterns: CSSPattern[] = [];
  const componentsDir = path.join(sourceRepo, 'src/stories/Components');
  const cssComponentsDir = path.join(opticsPackagePath, 'dist/css/components');

  const processDirectory = (dir: string, type: 'component' | 'layout' | 'utility') => {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      if (!fs.statSync(itemPath).isDirectory()) continue;

      const mdxPath = path.join(itemPath, `${item}.mdx`);
      const storiesPath = path.join(itemPath, `${item}.stories.js`);

      if (!fs.existsSync(mdxPath)) continue;

      console.log(`   Parsing ${item}...`);

      // Parse MDX for ALL class documentation
      const mdxData = parseComponentMdx(mdxPath, item);
      const baseClasses = getBaseClasses(mdxData.classes);

      // Parse stories for variants
      const storiesData = fs.existsSync(storiesPath) ? parseStoriesFile(storiesPath) : { variants: [], sizes: [] };

      // For multi-class components (like Form), use primary class, store all classes
      if (baseClasses.length > 1) {
        // Use first class as primary, collect all modifiers/elements across all base classes
        const primaryClass = baseClasses[0];
        const allModifiers: string[] = [];
        const allElements: string[] = [];

        for (const baseClass of baseClasses) {
          if (!validClasses.has(baseClass)) continue;

          // Collect modifiers
          const mods = Array.from(validClasses).filter(c => c.startsWith(`${baseClass}--`));
          allModifiers.push(...mods);

          // Collect elements
          const elems = Array.from(validClasses).filter(c => c.startsWith(`${baseClass}__`));
          allElements.push(...elems);
        }

        patterns.push({
          name: item,
          description: mdxData.componentDescription || `${item} component`,
          className: primaryClass,
          type,
          modifiers: [...new Set(allModifiers)].sort(),
          elements: [...new Set([...baseClasses.slice(1), ...allElements])].sort(), // Include other base classes as "elements"
          exampleHtml: generateExampleHtml(primaryClass, [], allElements),
          docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/components-${item.toLowerCase()}--docs`,
        });
      } else {
        // Single base class component - use first base class or derive from component name
        const className = baseClasses[0] || deriveClassName(item, validClasses);
        if (!className || !validClasses.has(className)) {
          console.log(`     ⚠️  No valid base class found for ${item}`);
          continue;
        }

        // Build modifiers list from MDX and validate against actual CSS
        let modifiers = mdxData.classes
          .filter(c => c.isModifier)
          .map(c => c.className)
          .filter(m => validClasses.has(m));

        // Add variant-based modifiers from stories
        for (const variant of storiesData.variants) {
          if (variant !== 'default') {
            const modClass = `${className}--${variant}`;
            if (validClasses.has(modClass) && !modifiers.includes(modClass)) {
              modifiers.push(modClass);
            }
          }
        }

        // Add size-based modifiers from stories
        for (const size of storiesData.sizes) {
          const sizeClass = `${className}--${size}`;
          if (validClasses.has(sizeClass) && !modifiers.includes(sizeClass)) {
            modifiers.push(sizeClass);
          }
        }

        // Also find modifiers from CSS
        const cssModifiers = Array.from(validClasses)
          .filter(c => c.startsWith(`${className}--`));

        modifiers = [...new Set([...modifiers, ...cssModifiers])].sort();

        // Extract elements (BEM __element classes)
        const elements = Array.from(validClasses)
          .filter(c => c.startsWith(`${className}__`))
          .sort();

        patterns.push({
          name: item,
          description: mdxData.componentDescription || `${item} component`,
          className,
          type,
          modifiers,
          elements,
          exampleHtml: generateExampleHtml(className, modifiers, elements),
          docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/${type === 'component' ? 'components' : type === 'layout' ? 'layout' : 'utilities'}-${item.toLowerCase()}--docs`,
        });
      }
    }
  };

  // Helper to derive class name from component name
  function deriveClassName(componentName: string, validClasses: Set<string>): string | null {
    // Try common patterns
    const patterns = [
      componentName.toLowerCase(),
      componentName.toLowerCase().replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
      componentName.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
    ];

    for (const pattern of patterns) {
      if (validClasses.has(pattern)) return pattern;
    }

    // Try finding a class that starts with component name
    const prefix = componentName.toLowerCase();
    for (const cls of validClasses) {
      if (cls.startsWith(prefix) && !cls.includes('--') && !cls.includes('__')) {
        return cls;
      }
    }

    return null;
  }

  processDirectory(componentsDir, 'component');
  // Skip utilities - they're CSS helpers, not components

  // Add layout utilities manually (op-stack, op-cluster, op-split)
  const layoutPatterns = ['op-stack', 'op-cluster', 'op-split'];
  for (const className of layoutPatterns) {
    if (validClasses.has(className)) {
      patterns.push({
        name: className.replace('op-', '').charAt(0).toUpperCase() + className.replace('op-', '').slice(1),
        description: `Layout utility: ${className}`,
        className,
        type: 'layout',
        modifiers: [],
        elements: [],
        exampleHtml: `<div class="${className}">...</div>`,
        docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/layout-${className.replace('op-', '')}--docs`,
      });
    }
  }

  // Add data-attribute patterns (Tooltip, etc.)
  patterns.push(...extractDataAttributePatterns(cssComponentsDir));

  return patterns;
}

// Extract patterns that use data attributes instead of classes (e.g., Tooltip)
function extractDataAttributePatterns(componentsDir: string): CSSPattern[] {
  const patterns: CSSPattern[] = [];

  if (!fs.existsSync(componentsDir)) return patterns;

  const dataAttrComponents: Record<string, { attr: string; description: string; positions?: string[] }> = {
    'tooltip.css': {
      attr: 'data-tooltip-text',
      description: 'CSS-only tooltip using data attributes',
      positions: ['top', 'bottom', 'left', 'right']
    }
  };

  for (const [cssFile, config] of Object.entries(dataAttrComponents)) {
    const cssPath = path.join(componentsDir, cssFile);
    if (!fs.existsSync(cssPath)) continue;

    const name = cssFile.replace('.css', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');

    patterns.push({
      name,
      description: config.description,
      className: `[${config.attr}]`,
      type: 'component',
      modifiers: config.positions?.map(p => `[data-tooltip-position="${p}"]`) || [],
      elements: [],
      exampleHtml: `<button ${config.attr}="Tooltip text" data-tooltip-position="top">Hover me</button>`,
      docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/components-${cssFile.replace('.css', '')}--docs`,
    });
  }

  return patterns;
}

function generateExampleHtml(className: string, modifiers: string[], elements: string[]): string {
  if (elements.length > 0) {
    const elementsHtml = elements
      .slice(0, 3)
      .map(el => `  <div class="${el}">...</div>`)
      .join('\n');
    return `<div class="${className}">\n${elementsHtml}\n</div>`;
  }

  if (className === 'btn') {
    return `<button class="btn btn--primary">Button</button>`;
  }

  return `<div class="${className}">...</div>`;
}

// ============================================================================
// Derive Components from CSS Files (when Storybook not available)
// Uses the component CSS files in dist/css/components/ from npm package
// ============================================================================

function deriveComponentsFromCSS(opticsPath: string, validClasses: Set<string>): CSSPattern[] {
  const patterns: CSSPattern[] = [];
  const componentsDir = path.join(opticsPath, 'dist/css/components');

  if (!fs.existsSync(componentsDir)) {
    console.log('   ⚠️  Components CSS directory not found');
    return patterns;
  }

  const cssFiles = fs.readdirSync(componentsDir).filter(f => f.endsWith('.css') && f !== 'index.css');

  for (const cssFile of cssFiles) {
    const cssPath = path.join(componentsDir, cssFile);
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    // Extract all classes from this CSS file
    const fileClasses = new Set<string>();
    const classRegex = /\.([a-z][a-z0-9_-]*)/g;
    let match;
    while ((match = classRegex.exec(cssContent)) !== null) {
      fileClasses.add(match[1]);
    }

    // Find base classes (no -- or __)
    const baseClasses = Array.from(fileClasses).filter(c => !c.includes('--') && !c.includes('__'));

    // Group classes by their base
    for (const baseClass of baseClasses) {
      if (!validClasses.has(baseClass)) continue;

      // Skip if we already have this base class
      if (patterns.some(p => p.className === baseClass)) continue;

      // Find modifiers and elements for this base class
      const modifiers = Array.from(fileClasses)
        .filter(c => c.startsWith(`${baseClass}--`))
        .sort();

      const elements = Array.from(fileClasses)
        .filter(c => c.startsWith(`${baseClass}__`))
        .sort();

      // Generate readable name from class
      const name = baseClass
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      // Generate description from CSS file header comment if available
      const headerMatch = cssContent.match(/\/\*\*?\s*\n?\s*\*?\s*([^*\n]+)/);
      const description = headerMatch ? headerMatch[1].trim() : `${name} component`;

      patterns.push({
        name,
        description,
        className: baseClass,
        type: 'component',
        modifiers,
        elements,
        exampleHtml: generateExampleHtml(baseClass, modifiers, elements),
        docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/components-${cssFile.replace('.css', '')}--docs`,
      });
    }
  }

  // Add layout utilities (these are in core/utilities, not components)
  const layoutPatterns = ['op-stack', 'op-cluster', 'op-split'];
  for (const className of layoutPatterns) {
    if (validClasses.has(className)) {
      const name = className.replace('op-', '').charAt(0).toUpperCase() + className.replace('op-', '').slice(1);
      patterns.push({
        name,
        description: `Layout utility: ${className}`,
        className,
        type: 'layout',
        modifiers: Array.from(validClasses).filter(c => c.startsWith(`${className}--`)),
        elements: [],
        exampleHtml: `<div class="${className}">...</div>`,
        docsUrl: `https://docs.optics.rolemodel.design/?path=/docs/layout-${className.replace('op-', '')}--docs`,
      });
    }
  }

  return patterns;
}

// ============================================================================
// Documentation - Preserve existing documentation from optics-data.ts
// ============================================================================

interface ExistingDoc {
  section: string;
  title: string;
  content: string;
  tokens?: string[];
}

function readExistingDocumentation(): ExistingDoc[] {
  // Read existing optics-data.ts to preserve manually written documentation
  if (!fs.existsSync(OUTPUT_FILE)) {
    return getDefaultDocumentation();
  }

  const content = fs.readFileSync(OUTPUT_FILE, 'utf-8');

  // Extract documentation array from file
  const docMatch = content.match(/export const documentation: Documentation\[\] = \[([\s\S]*?)\];(?=\s*$|\s*\/\/|\s*export)/);
  if (!docMatch) {
    return getDefaultDocumentation();
  }

  try {
    // Parse the documentation array (it's JSON-like)
    const docArrayStr = '[' + docMatch[1] + ']';
    // Remove trailing commas before parsing
    const cleanedStr = docArrayStr.replace(/,(\s*[\]}])/g, '$1');
    return JSON.parse(cleanedStr);
  } catch {
    console.log('   ⚠️  Could not parse existing documentation, using defaults');
    return getDefaultDocumentation();
  }
}

function getDefaultDocumentation(): ExistingDoc[] {
  return [
    {
      section: 'overview',
      title: 'Optics Overview',
      content: 'Optics is a CSS-only design system. It provides CSS custom properties (tokens) and utility classes - NOT JavaScript components. Use the provided CSS classes and tokens; do not write custom CSS for patterns that already exist.'
    },
    {
      section: 'color-pairing',
      title: 'Color Pairing Rule',
      content: 'CRITICAL: Background and text colors must ALWAYS be paired. Never use --op-color-{family}-{scale} without also setting color to --op-color-{family}-on-{scale}. The "on" tokens are calculated for proper contrast against their matching background.'
    },
    {
      section: 'color-system',
      title: 'HSL Color System',
      content: 'Optics uses HSL-based colors defined by -h (hue), -s (saturation), -l (lightness) tokens. A full scale is generated from plus-max (lightest) to minus-max (darkest). Each scale step has a matching "on-" token for text.'
    },
    {
      section: 'use-existing',
      title: 'Use Existing Classes',
      content: 'Don\'t write custom CSS for components that already exist. Use .btn for buttons, .card for cards, .op-stack/.op-cluster/.op-split for layouts. Only write custom CSS when truly extending the system.'
    }
  ];
}

function getDocumentation(tokens: DesignToken[]): Documentation[] {
  // Preserve existing manually-written documentation
  const existing = readExistingDocumentation();

  // Add tokens field based on section content
  return existing.map((doc: ExistingDoc): Documentation => {
    let sectionTokens: string[] = [];

    // Auto-populate tokens based on section type
    if (doc.section === 'color-system' || doc.section === 'color-pairing') {
      sectionTokens = tokens.filter((t: DesignToken) => t.category === 'color').map((t: DesignToken) => t.name);
    } else if (doc.section === 'spacing') {
      sectionTokens = tokens.filter((t: DesignToken) => t.category === 'spacing').map((t: DesignToken) => t.name);
    } else if (doc.section === 'typography') {
      sectionTokens = tokens.filter((t: DesignToken) => t.category === 'typography').map((t: DesignToken) => t.name);
    }

    return {
      section: doc.section,
      title: doc.title,
      content: doc.content,
      tokens: doc.tokens || sectionTokens
    };
  });
}

// ============================================================================
// Output Generation
// ============================================================================

function generateOutputFile(
  tokens: DesignToken[],
  patterns: CSSPattern[],
  docs: Documentation[],
  version: string
): string {
  const tokenCategories = Array.from(new Set(tokens.map(t => t.category))).sort();

  return `/**
 * Optics Design System Data
 * AUTO-GENERATED - Run: npm run sync-data
 * Version: ${version} | Generated: ${new Date().toISOString()}
 */

export type TokenCategory = ${tokenCategories.map(c => `'${c}'`).join(' | ')};

export interface DesignToken {
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
}

export interface CSSPattern {
  name: string;
  description: string;
  className: string;
  type: 'component' | 'layout' | 'utility';
  modifiers: string[];
  elements: string[];
  exampleHtml: string;
  docsUrl: string;
}

export interface Component extends CSSPattern {
  tokens: string[];
  usage: string;
  examples: string[];
}

export interface Documentation {
  section: string;
  title: string;
  content: string;
  tokens: string[];
}

export const designTokens: DesignToken[] = ${JSON.stringify(tokens, null, 2)};

export const cssPatterns: CSSPattern[] = ${JSON.stringify(patterns, null, 2)};

// Backwards compatibility: components alias with extended interface
export const components: Component[] = cssPatterns.map(p => ({
  ...p,
  tokens: p.modifiers,
  usage: p.description,
  examples: p.exampleHtml ? [p.exampleHtml] : [],
}));

export const documentation: Documentation[] = ${JSON.stringify(docs, null, 2)};
`;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  console.log('🔄 Syncing Optics data...\n');

  // Find Optics package
  const opticsPath = findOpticsPackage();
  if (!opticsPath) {
    console.error('❌ Could not find @rolemodel/optics package');
    console.error('   Run: npm install @rolemodel/optics');
    process.exit(1);
  }
  console.log(`📦 Found Optics package at: ${opticsPath}`);

  // Find Optics source repo
  const sourceRepo = findOpticsSourceRepo();
  if (sourceRepo) {
    console.log(`📂 Found Optics source repo at: ${sourceRepo}`);
  } else {
    console.log(`⚠️  Optics source repo not found at ${OPTICS_SOURCE_REPO}`);
    console.log('   Component data will use fallback patterns');
  }

  // Read package version
  const packageJson = JSON.parse(fs.readFileSync(path.join(opticsPath, 'package.json'), 'utf-8'));
  const version = packageJson.version;
  console.log(`📌 Version: ${version}\n`);

  // 1. Extract tokens from tokens.json if available
  let allTokens: DesignToken[] = [];
  const tokensJsonPath = path.join(opticsPath, 'dist/tokens/tokens.json');

  if (fs.existsSync(tokensJsonPath)) {
    console.log('📊 Parsing tokens.json...');
    const tokensJson = JSON.parse(fs.readFileSync(tokensJsonPath, 'utf-8'));
    allTokens = flattenTokens(tokensJson.op || tokensJson);
    console.log(`   ✓ Found ${allTokens.length} tokens from tokens.json`);
  } else {
    // Fallback: parse CSS files
    console.log('📄 Parsing CSS files for tokens...');
    const cssDistPath = path.join(opticsPath, 'dist/css');

    const findCSSFiles = (dir: string): string[] => {
      const files: string[] = [];
      if (!fs.existsSync(dir)) return files;

      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...findCSSFiles(fullPath));
        } else if (entry.name.endsWith('.css')) {
          files.push(fullPath);
        }
      }
      return files;
    };

    const cssFiles = findCSSFiles(cssDistPath);
    for (const cssFile of cssFiles) {
      const content = fs.readFileSync(cssFile, 'utf-8');
      allTokens.push(...extractTokensFromCSS(content));
    }

    // Dedupe
    const seenTokens = new Set<string>();
    allTokens = allTokens.filter(t => {
      if (seenTokens.has(t.name)) return false;
      seenTokens.add(t.name);
      return true;
    });
    console.log(`   ✓ Found ${allTokens.length} tokens from CSS`);
  }

  // 2. Extract valid CSS classes for validation
  console.log('\n🎨 Extracting CSS classes for validation...');
  let validClasses = new Set<string>();
  const cssDistPath = path.join(opticsPath, 'dist/css');

  const findCSSFiles = (dir: string): string[] => {
    const files: string[] = [];
    if (!fs.existsSync(dir)) return files;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...findCSSFiles(fullPath));
      } else if (entry.name.endsWith('.css')) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const cssFiles = findCSSFiles(cssDistPath);
  for (const cssFile of cssFiles) {
    const content = fs.readFileSync(cssFile, 'utf-8');
    const classes = extractCSSClasses(content);
    classes.forEach(c => validClasses.add(c));
  }
  console.log(`   ✓ Found ${validClasses.size} valid CSS classes`);

  // 3. Scrape components from Storybook source or derive from CSS
  let patterns: CSSPattern[] = [];

  if (sourceRepo) {
    console.log('\n📖 Scraping components from Storybook source...');
    patterns = scrapeComponentsFromStorybook(sourceRepo, opticsPath, validClasses);
    console.log(`   ✓ Found ${patterns.length} components`);
  } else {
    console.log('\n📄 Deriving components from CSS files in npm package...');
    console.log('   (For richer documentation, clone https://github.com/RoleModel/optics to ../../optics)');
    patterns = deriveComponentsFromCSS(opticsPath, validClasses);
    console.log(`   ✓ Derived ${patterns.length} components from CSS`);
  }

  // 4. Get documentation
  console.log('\n📚 Loading documentation...');
  const docs = getDocumentation(allTokens);
  console.log(`   ✓ ${docs.length} documentation sections`);

  // 5. Generate output
  console.log('\n✍️  Generating optics-data.ts...');
  const output = generateOutputFile(allTokens, patterns, docs, version);
  fs.writeFileSync(OUTPUT_FILE, output);
  console.log(`   ✓ Written to ${OUTPUT_FILE}`);

  // Summary
  const byCategory: Record<string, number> = {};
  allTokens.forEach(t => {
    byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  });

  console.log('\n✅ Sync complete!');
  console.log(`   - Optics v${version}`);
  console.log(`   - ${allTokens.length} tokens across ${Object.keys(byCategory).length} categories`);
  console.log(`   - ${patterns.length} CSS patterns`);
  console.log(`   - ${docs.length} documentation sections`);

  console.log('\n   Token categories:');
  Object.entries(byCategory).sort().forEach(([cat, count]) => {
    console.log(`     - ${cat}: ${count}`);
  });
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
