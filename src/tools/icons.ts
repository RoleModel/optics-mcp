/**
 * Icon Tools for Optics Design System
 * Supports multiple icon libraries with varying feature sets
 */

export interface IconLibrary {
  name: string;
  prefix: string;
  import: string;
  supports: {
    fill: boolean;
    weight: boolean;
    emphasis: boolean;
    size: boolean;
    duotone?: boolean;
  };
  usage: string;
  notes?: string;
}

export interface IconConfig {
  library: string;
  name: string;
  size?: 'small' | 'medium' | 'large' | 'x-large';
  weight?: 'light' | 'normal' | 'semi-bold' | 'bold' | 'thin';
  fill?: boolean;
  emphasis?: 'low' | 'normal' | 'high';
}

/**
 * Supported icon libraries in Optics
 */
export const iconLibraries: IconLibrary[] = [
  {
    name: 'Material Symbols',
    prefix: 'material-symbols-outlined',
    import: `@import '@rolemodel/optics/dist/css/core/fonts';`,
    supports: { fill: true, weight: true, emphasis: true, size: true },
    usage: '<span class="icon material-symbols-outlined">settings</span>',
    notes: 'Default icon library. Full variable font support with fill, weight, emphasis, and size.'
  },
  {
    name: 'Phosphor',
    prefix: 'ph',
    import: `@import '@rolemodel/optics/dist/css/addons/fonts/phosphor_icons';`,
    supports: { fill: true, weight: true, emphasis: false, size: true, duotone: true },
    usage: '<i class="icon ph ph-smiley"></i>',
    notes: 'Supports .ph-duotone for two-tone icons. Adds .icon--weight-thin. Does not support .icon--weight-semi-bold or emphasis.'
  },
  {
    name: 'Tabler',
    prefix: 'ti',
    import: `@import '@rolemodel/optics/dist/css/addons/fonts/tabler_icons';`,
    supports: { fill: true, weight: false, emphasis: false, size: true },
    usage: '<i class="icon ti ti-settings"></i>',
    notes: 'For filled icons, use .ti-{name}-filled instead of .icon--filled modifier.'
  },
  {
    name: 'Feather',
    prefix: 'fi',
    import: `@import '@rolemodel/optics/dist/css/addons/fonts/feather_icons';`,
    supports: { fill: false, weight: false, emphasis: false, size: true },
    usage: '<i class="icon fi fi-feather"></i>',
    notes: 'Minimal feature set. CDN does not include all icons. Consider Lucide for more icons.'
  },
  {
    name: 'Lucide',
    prefix: 'li',
    import: `@import '@rolemodel/optics/dist/css/addons/fonts/lucide_icons';`,
    supports: { fill: false, weight: false, emphasis: false, size: true },
    usage: '<i class="icon li li-banana"></i>',
    notes: 'Fork of Feather with more icons. Larger library but same limited modifier support.'
  }
];

/**
 * Size modifiers available for icons
 */
export const sizeModifiers = {
  small: 'icon--small',
  medium: 'icon--medium',
  large: 'icon--large',
  'x-large': 'icon--x-large'
};

/**
 * Weight modifiers (availability varies by library)
 */
export const weightModifiers = {
  thin: 'icon--weight-thin',       // Phosphor only
  light: 'icon--weight-light',
  normal: 'icon--weight-normal',
  'semi-bold': 'icon--weight-semi-bold',  // Not Phosphor
  bold: 'icon--weight-bold'
};

/**
 * Emphasis modifiers (Material Symbols only)
 */
export const emphasisModifiers = {
  low: 'icon--low-emphasis',
  normal: 'icon--normal-emphasis',
  high: 'icon--high-emphasis'
};

/**
 * Get library by name
 */
export function getLibrary(name: string): IconLibrary | undefined {
  return iconLibraries.find(lib =>
    lib.name.toLowerCase() === name.toLowerCase() ||
    lib.prefix === name.toLowerCase()
  );
}

/**
 * Generate HTML for an icon
 */
export function generateIconHTML(config: IconConfig): string {
  const library = getLibrary(config.library);
  if (!library) {
    return `<!-- Unknown library: ${config.library} -->`;
  }

  const classes = ['icon'];

  // Add library-specific prefix
  if (library.prefix === 'material-symbols-outlined') {
    classes.push('material-symbols-outlined');
  } else {
    classes.push(library.prefix);
    classes.push(`${library.prefix}-${config.name}`);
  }

  // Add size modifier
  if (config.size && library.supports.size) {
    classes.push(sizeModifiers[config.size]);
  }

  // Add weight modifier
  if (config.weight && library.supports.weight) {
    classes.push(weightModifiers[config.weight]);
  }

  // Add fill modifier
  if (config.fill && library.supports.fill) {
    if (library.prefix === 'ti') {
      // Tabler uses different pattern for filled
      classes[classes.length - 1] = `ti-${config.name}-filled`;
    } else {
      classes.push('icon--filled');
    }
  }

  // Add emphasis modifier
  if (config.emphasis && library.supports.emphasis) {
    classes.push(emphasisModifiers[config.emphasis]);
  }

  // Generate HTML based on library
  if (library.prefix === 'material-symbols-outlined') {
    return `<span class="${classes.join(' ')}">${config.name}</span>`;
  } else {
    return `<i class="${classes.join(' ')}"></i>`;
  }
}

/**
 * Generate import statement for a library
 */
export function generateImport(libraryName: string): string {
  const library = getLibrary(libraryName);
  if (!library) {
    return `/* Unknown library: ${libraryName} */`;
  }

  if (library.prefix === 'material-symbols-outlined') {
    return `/* Material Symbols (default - included with Optics) */
${library.import}`;
  }

  return `/* ${library.name} Icons */
@import '@rolemodel/optics';
${library.import}`;
}

/**
 * Format library comparison for display
 */
export function formatLibraryComparison(): string {
  let output = `# Optics Icon Libraries

| Library | Prefix | Fill | Weight | Emphasis | Size | Notes |
|---------|--------|------|--------|----------|------|-------|
`;

  for (const lib of iconLibraries) {
    const s = lib.supports;
    output += `| ${lib.name} | \`.${lib.prefix}\` | ${s.fill ? '✓' : '✗'} | ${s.weight ? '✓' : '✗'} | ${s.emphasis ? '✓' : '✗'} | ${s.size ? '✓' : '✗'} | ${lib.notes || ''} |\n`;
  }

  output += `
## Usage Examples

`;

  for (const lib of iconLibraries) {
    output += `### ${lib.name}

\`\`\`css
${lib.import}
\`\`\`

\`\`\`html
${lib.usage}
\`\`\`

`;
  }

  return output;
}

/**
 * Format icon configuration output
 */
export function formatIconConfig(config: IconConfig): string {
  const library = getLibrary(config.library);
  if (!library) {
    return `Unknown library: ${config.library}\n\nAvailable libraries: ${iconLibraries.map(l => l.name).join(', ')}`;
  }

  const html = generateIconHTML(config);
  const importStatement = generateImport(config.library);

  let output = `## ${library.name} Icon: ${config.name}

### Import

\`\`\`css
${importStatement}
\`\`\`

### HTML

\`\`\`html
${html}
\`\`\`

### Configuration

| Option | Value | Supported |
|--------|-------|-----------|
| Size | ${config.size || 'medium (default)'} | ${library.supports.size ? '✓' : '✗'} |
| Weight | ${config.weight || 'normal (default)'} | ${library.supports.weight ? '✓' : '✗'} |
| Fill | ${config.fill ? 'filled' : 'outlined'} | ${library.supports.fill ? '✓' : '✗'} |
| Emphasis | ${config.emphasis || 'normal (default)'} | ${library.supports.emphasis ? '✓' : '✗'} |
`;

  if (library.notes) {
    output += `\n### Notes\n\n${library.notes}`;
  }

  return output;
}

/**
 * Suggest best library for use case
 */
export function suggestLibrary(requirements: {
  needsFill?: boolean;
  needsWeight?: boolean;
  needsEmphasis?: boolean;
  needsDuotone?: boolean;
  preferSmallBundle?: boolean;
}): IconLibrary[] {
  return iconLibraries.filter(lib => {
    if (requirements.needsFill && !lib.supports.fill) return false;
    if (requirements.needsWeight && !lib.supports.weight) return false;
    if (requirements.needsEmphasis && !lib.supports.emphasis) return false;
    if (requirements.needsDuotone && !lib.supports.duotone) return false;
    return true;
  }).sort((a, b) => {
    // Prefer libraries with more features unless small bundle needed
    if (requirements.preferSmallBundle) {
      const aFeatures = Object.values(a.supports).filter(Boolean).length;
      const bFeatures = Object.values(b.supports).filter(Boolean).length;
      return aFeatures - bFeatures;
    }
    return 0;
  });
}
