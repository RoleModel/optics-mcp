/**
 * Component token dependency utilities
 */

import { components, designTokens, type DesignToken } from '../optics-data.js';

/**
 * Get component token dependencies
 */
export function getComponentTokenDependencies(componentName: string) {
  const component = components.find(c =>
    c.name.toLowerCase() === componentName.toLowerCase()
  );

  if (!component) {
    return null;
  }

  const tokenDetails = component.tokens.map((tokenName: string) =>
    designTokens.find(t => t.name === tokenName)
  ).filter((token): token is DesignToken => token !== undefined);

  return {
    component: component.name,
    description: component.description,
    tokenCount: component.tokens.length,
    tokens: tokenDetails
  };
}
