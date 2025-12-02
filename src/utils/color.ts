/**
 * Color utility functions for contrast calculations and color parsing
 */

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface ContrastResult {
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
  score: 'fail' | 'AA' | 'AAA';
}

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): RGB | null {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Handle 3-digit hex
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  if (hex.length !== 6) {
    return null;
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return { r, g, b };
}

/**
 * Parse rgb/rgba string to RGB
 */
export function rgbStringToRgb(rgbString: string): RGB | null {
  const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) {
    return null;
  }
  
  return {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  };
}

/**
 * Parse any color format to RGB
 */
export function parseColor(color: string): RGB | null {
  const trimmed = color.trim();
  
  if (trimmed.startsWith('#')) {
    return hexToRgb(trimmed);
  }
  
  if (trimmed.startsWith('rgb')) {
    return rgbStringToRgb(trimmed);
  }
  
  return null;
}

/**
 * Calculate relative luminance for a color
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getRelativeLuminance(rgb: RGB): number {
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;
  
  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function getContrastRatio(color1: string, color2: string): number | null {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);
  
  if (!rgb1 || !rgb2) {
    return null;
  }
  
  const l1 = getRelativeLuminance(rgb1);
  const l2 = getRelativeLuminance(rgb2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
export function checkContrast(foreground: string, background: string): ContrastResult | null {
  const ratio = getContrastRatio(foreground, background);
  
  if (ratio === null) {
    return null;
  }
  
  // WCAG 2.1 standards
  // AA: 4.5:1 for normal text, 3:1 for large text
  // AAA: 7:1 for normal text, 4.5:1 for large text
  const wcagAA = ratio >= 4.5;
  const wcagAAA = ratio >= 7;
  
  let score: 'fail' | 'AA' | 'AAA' = 'fail';
  if (wcagAAA) {
    score = 'AAA';
  } else if (wcagAA) {
    score = 'AA';
  }
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAA,
    wcagAAA,
    score
  };
}

/**
 * RGB to hex conversion
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
