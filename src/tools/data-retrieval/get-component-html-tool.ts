/**
 * Get Component HTML Tool
 * Returns exact HTML/classes for an Optics component
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from '../tool.js';
import { components, type Component } from '../../optics-data.js';
import { readToolFile } from '../../_internal/resource-path.js';

export interface ComponentHTMLResult {
  found: boolean;
  component?: Component;
  variant?: string;
  variantHtml?: string;
  error?: string;
}

class GetComponentHtmlTool extends Tool {
  name = 'get_component_html';
  title = 'Get Component HTML';
  description = 'Get the exact HTML structure and CSS classes for an Optics component';

  inputSchema = {
    componentName: z.string().describe('Name of the component (e.g., "Button", "Card", "Alert")'),
    variant: z.string().optional().describe('Optional variant/modifier (e.g., "primary", "danger", "filled")'),
  };

  async handler(args: ToolInputSchema): Promise<string> {
    const { componentName, variant } = args;
    const result = this.getComponentHtml(componentName, variant);
    const formatted = await this.formatResult(result);

    return formatted;
  }

  /**
   * Get component HTML and details
   */
  private getComponentHtml(componentName: string, variant?: string): ComponentHTMLResult {
    const component = components.find(
      c => c.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!component) {
      // Try to find partial matches
      const partialMatches = components.filter(
        c => c.name.toLowerCase().includes(componentName.toLowerCase()) ||
             componentName.toLowerCase().includes(c.name.toLowerCase())
      );

      if (partialMatches.length > 0) {
        return {
          found: false,
          error: `Component "${componentName}" not found. Did you mean: ${partialMatches.map(c => c.name).join(', ')}?`
        };
      }

      return {
        found: false,
        error: `Component "${componentName}" not found. Use list_components to see available components.`
      };
    }

    // If variant specified, generate variant-specific HTML
    let variantHtml: string | undefined;
    if (variant) {
      const matchingModifier = component.modifiers.find(
        m => m.toLowerCase().includes(variant.toLowerCase())
      );

      if (matchingModifier) {
        // Generate HTML with the variant class applied
        variantHtml = this.applyVariantToHtml(component.exampleHtml, component.className, matchingModifier);
      }
    }

    return {
      found: true,
      component,
      variant,
      variantHtml
    };
  }

  /**
   * Apply a variant modifier to the example HTML
   */
  private applyVariantToHtml(html: string, baseClass: string, modifier: string): string {
    // Replace the base class with base class + modifier
    const classPattern = new RegExp(`class="([^"]*\\b${baseClass}\\b[^"]*)"`, 'g');
    return html.replace(classPattern, (match, classes) => {
      // Check if modifier already exists
      if (classes.includes(modifier)) {
        return match;
      }
      return `class="${classes} ${modifier}"`;
    });
  }

  /**
   * Format the result
   */
  private async formatResult(result: ComponentHTMLResult): Promise<string> {
    if (!result.found || !result.component) {
      return `# Component Not Found\n\n${result.error}`;
    }

    const component = result.component;
    const template = await readToolFile('get-component-html-result.md');

    // Format modifiers list
    const modifiersText = component.modifiers.length > 0
      ? component.modifiers.map(m => `- \`${m}\``).join('\n')
      : 'No modifiers available';

    // Format elements list
    const elementsText = component.elements.length > 0
      ? component.elements.map(e => `- \`${e}\``).join('\n')
      : 'No sub-elements defined';

    // Use variant HTML if available, otherwise use base example
    const htmlToShow = result.variantHtml || component.exampleHtml;

    let output = template
      .replace('{{componentName}}', component.name)
      .replace('{{exampleHtml}}', htmlToShow)
      .replace('{{className}}', component.className)
      .replace('{{type}}', component.type)
      .replace('{{modifiers}}', modifiersText)
      .replace('{{elements}}', elementsText)
      .replace('{{docsUrl}}', component.docsUrl || 'No documentation URL available')
      .replace('{{description}}', component.description);

    // Add variant info if specified
    if (result.variant && result.variantHtml) {
      output += `\n\n## Applied Variant\n- **Variant**: \`${result.variant}\`\n- The HTML above includes the variant modifier class.`;
    } else if (result.variant && !result.variantHtml) {
      const availableVariants = component.modifiers
        .filter(m => m.includes('--'))
        .map(m => m.split('--')[1])
        .join(', ');
      output += `\n\n## Variant Note\nVariant "${result.variant}" not found. Available variants: ${availableVariants || 'none'}`;
    }

    return output;
  }
}

export default GetComponentHtmlTool;
