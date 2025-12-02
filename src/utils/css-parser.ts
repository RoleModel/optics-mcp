/**
 * CSS parser utility for extracting and analyzing CSS values
 */

export interface CSSValue {
  type: 'color' | 'spacing' | 'font-size' | 'font-weight' | 'font-family' | 'border-radius' | 'shadow' | 'unknown';
  value: string;
  line?: number;
  property?: string;
}

/**
 * Extract color values from CSS
 */
export function extractColors(css: string): CSSValue[] {
  const colors: CSSValue[] = [];
  
  // Hex colors
  const hexRegex = /#[0-9a-fA-F]{3,6}\b/g;
  let match;
  while ((match = hexRegex.exec(css)) !== null) {
    colors.push({
      type: 'color',
      value: match[0]
    });
  }
  
  // RGB/RGBA
  const rgbRegex = /rgba?\([^)]+\)/g;
  while ((match = rgbRegex.exec(css)) !== null) {
    colors.push({
      type: 'color',
      value: match[0]
    });
  }
  
  return colors;
}

/**
 * Extract spacing values (px, rem, em)
 */
export function extractSpacing(css: string): CSSValue[] {
  const spacing: CSSValue[] = [];
  
  // Match spacing properties
  const spacingProps = ['padding', 'margin', 'gap', 'width', 'height', 'top', 'bottom', 'left', 'right'];
  const spacingRegex = new RegExp(`(${spacingProps.join('|')}):\\s*([\\d.]+(?:px|rem|em))`, 'gi');
  
  let match;
  while ((match = spacingRegex.exec(css)) !== null) {
    spacing.push({
      type: 'spacing',
      value: match[2],
      property: match[1]
    });
  }
  
  return spacing;
}

/**
 * Extract font sizes
 */
export function extractFontSizes(css: string): CSSValue[] {
  const sizes: CSSValue[] = [];
  const regex = /font-size:\s*([\\d.]+(?:px|rem|em))/gi;
  
  let match;
  while ((match = regex.exec(css)) !== null) {
    sizes.push({
      type: 'font-size',
      value: match[1],
      property: 'font-size'
    });
  }
  
  return sizes;
}

/**
 * Extract font weights
 */
export function extractFontWeights(css: string): CSSValue[] {
  const weights: CSSValue[] = [];
  const regex = /font-weight:\s*(\\d{3}|normal|bold|lighter|bolder)/gi;
  
  let match;
  while ((match = regex.exec(css)) !== null) {
    weights.push({
      type: 'font-weight',
      value: match[1],
      property: 'font-weight'
    });
  }
  
  return weights;
}

/**
 * Extract font families
 */
export function extractFontFamilies(css: string): CSSValue[] {
  const families: CSSValue[] = [];
  const regex = /font-family:\s*([^;]+)/gi;
  
  let match;
  while ((match = regex.exec(css)) !== null) {
    families.push({
      type: 'font-family',
      value: match[1].trim(),
      property: 'font-family'
    });
  }
  
  return families;
}

/**
 * Extract border radius values
 */
export function extractBorderRadius(css: string): CSSValue[] {
  const radii: CSSValue[] = [];
  const regex = /border-radius:\s*([\\d.]+(?:px|rem|em|%))/gi;
  
  let match;
  while ((match = regex.exec(css)) !== null) {
    radii.push({
      type: 'border-radius',
      value: match[1],
      property: 'border-radius'
    });
  }
  
  return radii;
}

/**
 * Extract box shadow values
 */
export function extractShadows(css: string): CSSValue[] {
  const shadows: CSSValue[] = [];
  const regex = /box-shadow:\s*([^;]+)/gi;
  
  let match;
  while ((match = regex.exec(css)) !== null) {
    shadows.push({
      type: 'shadow',
      value: match[1].trim(),
      property: 'box-shadow'
    });
  }
  
  return shadows;
}

/**
 * Extract all hard-coded values from CSS
 */
export function extractAllValues(css: string): CSSValue[] {
  return [
    ...extractColors(css),
    ...extractSpacing(css),
    ...extractFontSizes(css),
    ...extractFontWeights(css),
    ...extractFontFamilies(css),
    ...extractBorderRadius(css),
    ...extractShadows(css)
  ];
}

/**
 * Check if a value matches a design token value
 */
export function findMatchingToken(value: string, tokens: Array<{ name: string; value: string; category: string }>): string | null {
  // Normalize values for comparison
  const normalizeValue = (v: string) => v.toLowerCase().replace(/\s+/g, '');
  const normalizedValue = normalizeValue(value);
  
  for (const token of tokens) {
    if (normalizeValue(token.value) === normalizedValue) {
      return token.name;
    }
  }
  
  return null;
}

/**
 * Group values by type
 */
export function groupValuesByType(values: CSSValue[]): Record<string, CSSValue[]> {
  const grouped: Record<string, CSSValue[]> = {};
  
  for (const value of values) {
    if (!grouped[value.type]) {
      grouped[value.type] = [];
    }
    grouped[value.type].push(value);
  }
  
  return grouped;
}
