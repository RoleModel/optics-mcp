/**
 * Generate Component Scaffold Tool
 * Generates component templates with proper token usage
 */

import { z } from 'zod';
import Tool from './tool.js';
import { DesignToken, designTokens } from '../optics-data.js';
import { readToolFile } from '../_internal/resource-path.js';

export interface ComponentScaffold {
  name: string;
  typescript: string;
  css: string;
  usage: string;
}

class GenerateComponentScaffoldTool extends Tool {
  name = 'generate_component_scaffold';
  title = 'Generate Component Scaffold';
  description = 'Generate a React component scaffold with proper token usage';

  inputSchema = {
    componentName: z.string().describe('Name of the component (e.g., "Alert", "Card")'),
    description: z.string().describe('Brief description of the component'),
    tokens: z.array(z.string()).describe('List of token names the component should use'),
  };

  async handler(args: any): Promise<string> {
    const { componentName, description, tokens } = args;
    const scaffold = await this.generateComponentScaffold(
      componentName,
      description,
      tokens,
      designTokens
    );
    const formatted = this.formatScaffoldOutput(scaffold);

    return formatted;
  }

  /**
   * Generate component scaffold
   */
  private async generateComponentScaffold(
    componentName: string,
    description: string,
    requiredTokens: string[],
    allTokens: DesignToken[]
  ): Promise<ComponentScaffold> {
    const validTokens = requiredTokens.filter(tokenName =>
      allTokens.some(t => t.name === tokenName)
    );

    const typescript = this.generateTypeScriptComponent(componentName, description, validTokens);
    const css = this.generateCSSModule(componentName, validTokens, allTokens);
    const usage = await this.generateUsageExample(componentName);

    return {
      name: componentName,
      typescript,
      css,
      usage
    };
  }

  /**
   * Generate TypeScript component
   */
  private generateTypeScriptComponent(
    name: string,
    description: string,
    tokens: string[]
  ): string {
    const lines: string[] = [
      `/**`,
      ` * ${name} Component`,
      ` * ${description}`,
      ` * `,
      ` * Design tokens used:`,
      ...tokens.map(t => ` * - ${t}`),
      ` */`,
      ``,
      `import React from 'react';`,
      `import styles from './${name}.module.css';`,
      ``,
      `export interface ${name}Props {`,
      `  children: React.ReactNode;`,
      `  className?: string;`,
      `}`,
      ``,
      `export const ${name}: React.FC<${name}Props> = ({ children, className }) => {`,
      `  return (`,
      `    <div className={\`\${styles.${name.toLowerCase()}} \${className || ''}\`}>`,
      `      {children}`,
      `    </div>`,
      `  );`,
      `};`
    ];

    return lines.join('\n');
  }

  /**
   * Generate CSS module
   */
  private generateCSSModule(
    name: string,
    tokenNames: string[],
    allTokens: DesignToken[]
  ): string {
    const lines: string[] = [
      `/**`,
      ` * ${name} Component Styles`,
      ` * Uses Optics design tokens for consistent styling`,
      ` */`,
      ``,
      `.${name.toLowerCase()} {`
    ];

    // Group tokens by category
    const colorTokens = tokenNames.filter(t => allTokens.find(token => token.name === t && token.category === 'color'));
    const spacingTokens = tokenNames.filter(t => allTokens.find(token => token.name === t && token.category === 'spacing'));
    const typographyTokens = tokenNames.filter(t => allTokens.find(token => token.name === t && token.category === 'typography'));
    const borderTokens = tokenNames.filter(t => allTokens.find(token => token.name === t && token.category === 'border'));
    const shadowTokens = tokenNames.filter(t => allTokens.find(token => token.name === t && token.category === 'shadow'));

    // Add color properties
    if (colorTokens.length > 0) {
      lines.push(`  /* Colors */`);
      if (colorTokens.some(t => t.includes('background'))) {
        const bgToken = colorTokens.find(t => t.includes('background'));
        lines.push(`  background-color: var(--${bgToken});`);
      }
      if (colorTokens.some(t => t.includes('text') || t.includes('color-primary'))) {
        const textToken = colorTokens.find(t => t.includes('text')) || colorTokens[0];
        lines.push(`  color: var(--${textToken});`);
      }
    }

    // Add spacing
    if (spacingTokens.length > 0) {
      lines.push(`  /* Spacing */`);
      const paddingToken = spacingTokens[0];
      lines.push(`  padding: var(--${paddingToken});`);
    }

    // Add typography
    if (typographyTokens.length > 0) {
      lines.push(`  /* Typography */`);
      typographyTokens.forEach(token => {
        if (token.includes('font-size')) {
          lines.push(`  font-size: var(--${token});`);
        } else if (token.includes('font-weight')) {
          lines.push(`  font-weight: var(--${token});`);
        } else if (token.includes('line-height')) {
          lines.push(`  line-height: var(--${token});`);
        } else if (token.includes('font-family')) {
          lines.push(`  font-family: var(--${token});`);
        }
      });
    }

    // Add borders
    if (borderTokens.length > 0) {
      lines.push(`  /* Borders */`);
      lines.push(`  border-radius: var(--${borderTokens[0]});`);
    }

    // Add shadows
    if (shadowTokens.length > 0) {
      lines.push(`  /* Elevation */`);
      lines.push(`  box-shadow: var(--${shadowTokens[0]});`);
    }

    lines.push(`}`);
    lines.push(``);

    return lines.join('\n');
  }

  /**
   * Generate usage example
   */
  private async generateUsageExample(name: string): Promise<string> {
    const template = await readToolFile('generate-component-scaffold-usage.md');

    return template.replace(/{{componentName}}/g, name);
  }

  /**
   * Format scaffold output
   */
  private formatScaffoldOutput(scaffold: ComponentScaffold): string {
    const lines: string[] = [
      `# ${scaffold.name} Component Scaffold`,
      ``,
      `## TypeScript Component`,
      `\`\`\`typescript`,
      scaffold.typescript,
      `\`\`\``,
      ``,
      `## CSS Module`,
      `\`\`\`css`,
      scaffold.css,
      `\`\`\``,
      ``,
      `## Usage`,
      scaffold.usage
    ];

    return lines.join('\n');
  }
}

export default GenerateComponentScaffoldTool;
