/**
 * Figma tokens formatter
 * Outputs tokens in Figma's native Variables format
 * https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma
 */

import { DesignToken } from '../optics-data.js';

export interface FigmaVariable {
  id: string;
  name: string;
  resolvedType: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: {
    [modeId: string]: FigmaVariableValue;
  };
  description?: string;
  remote: boolean;
  key: string;
}

export interface FigmaVariableValue {
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  value?: number | string;
}

export interface FigmaCollection {
  id: string;
  name: string;
  modes: Array<{
    modeId: string;
    name: string;
  }>;
  variableIds: string[];
  defaultModeId: string;
  remote: boolean;
  key: string;
}

/**
 * Map Optics token categories to Figma variable types
 */
function mapToFigmaType(category: string, tokenName: string): 'COLOR' | 'FLOAT' | 'STRING' {
  if (category === 'color') return 'COLOR';
  if (category === 'spacing' || category === 'border') return 'FLOAT';
  if (tokenName.includes('font-size') || tokenName.includes('line-height')) return 'FLOAT';
  if (tokenName.includes('font-weight')) return 'FLOAT';
  return 'STRING';
}

/**
 * Parse color value to RGBA for Figma
 */
function parseColorToRGBA(colorValue: string): { r: number; g: number; b: number; a: number } {
  // Remove # and parse hex
  const hex = colorValue.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r, g, b, a: 1 };
}

/**
 * Parse numeric value (px, rem, etc.) to float
 */
function parseNumericValue(value: string): number {
  const match = value.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

/**
 * Create Figma variable value based on token type
 */
function createVariableValue(token: DesignToken, type: 'COLOR' | 'FLOAT' | 'STRING'): FigmaVariableValue {
  if (type === 'COLOR') {
    return parseColorToRGBA(token.value);
  }
  if (type === 'FLOAT') {
    return { value: parseNumericValue(token.value) };
  }
  return { value: token.value };
}

/**
 * Generate unique ID for Figma variable
 */
function generateVariableId(tokenName: string): string {
  return `VariableID:${tokenName.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

/**
 * Convert Optics tokens to Figma Variables format
 */
export function convertToFigmaVariables(
  tokens: DesignToken[],
  collectionName: string = 'Optics Design System'
): { collection: FigmaCollection; variables: FigmaVariable[] } {
  const modeId = 'mode-default';
  const collectionId = `collection-${collectionName.replace(/\s+/g, '-').toLowerCase()}`;
  
  const variables: FigmaVariable[] = [];
  const variableIds: string[] = [];
  
  for (const token of tokens) {
    const variableId = generateVariableId(token.name);
    const resolvedType = mapToFigmaType(token.category, token.name);
    const variableValue = createVariableValue(token, resolvedType);
    
    variables.push({
      id: variableId,
      name: token.name,
      resolvedType,
      valuesByMode: {
        [modeId]: variableValue
      },
      description: token.description || '',
      remote: false,
      key: variableId
    });
    
    variableIds.push(variableId);
  }
  
  const collection: FigmaCollection = {
    id: collectionId,
    name: collectionName,
    modes: [
      {
        modeId,
        name: 'Default'
      }
    ],
    variableIds,
    defaultModeId: modeId,
    remote: false,
    key: collectionId
  };
  
  return { collection, variables };
}

/**
 * Generate Figma Variables JSON file content
 */
export function generateFigmaVariablesJSON(
  tokens: DesignToken[],
  options?: {
    collectionName?: string;
    prettify?: boolean;
  }
): string {
  const { collectionName = 'Optics Design System', prettify = true } = options || {};
  
  const { collection, variables } = convertToFigmaVariables(tokens, collectionName);
  
  const output = {
    version: 1,
    collections: [collection],
    variables
  };
  
  return JSON.stringify(output, null, prettify ? 2 : 0);
}

/**
 * Create multiple Figma collections with different modes/themes
 */
export function createMultiModeVariables(
  themeSets: Array<{
    modeName: string;
    tokens: DesignToken[];
  }>,
  collectionName: string = 'Optics Themes'
): { collection: FigmaCollection; variables: FigmaVariable[] } {
  const collectionId = `collection-${collectionName.replace(/\s+/g, '-').toLowerCase()}`;
  const modes = themeSets.map((set, index) => ({
    modeId: `mode-${set.modeName.toLowerCase()}`,
    name: set.modeName
  }));
  
  const defaultModeId = modes[0].modeId;
  
  // Create variables with values for each mode
  const variablesMap = new Map<string, FigmaVariable>();
  
  for (const themeSet of themeSets) {
    const modeId = `mode-${themeSet.modeName.toLowerCase()}`;
    
    for (const token of themeSet.tokens) {
      const variableId = generateVariableId(token.name);
      const resolvedType = mapToFigmaType(token.category, token.name);
      const variableValue = createVariableValue(token, resolvedType);
      
      if (variablesMap.has(variableId)) {
        // Add value for this mode to existing variable
        const existingVar = variablesMap.get(variableId)!;
        existingVar.valuesByMode[modeId] = variableValue;
      } else {
        // Create new variable
        variablesMap.set(variableId, {
          id: variableId,
          name: token.name,
          resolvedType,
          valuesByMode: {
            [modeId]: variableValue
          },
          description: token.description || '',
          remote: false,
          key: variableId
        });
      }
    }
  }
  
  const variables = Array.from(variablesMap.values());
  const variableIds = variables.map(v => v.id);
  
  const collection: FigmaCollection = {
    id: collectionId,
    name: collectionName,
    modes,
    variableIds,
    defaultModeId,
    remote: false,
    key: collectionId
  };
  
  return { collection, variables };
}
