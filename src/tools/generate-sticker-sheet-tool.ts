/**
 * Generate Sticker Sheet Tool
 * Generates visual style guide with color swatches and component examples
 */

import { z } from 'zod';
import Tool from './tool.js';
import { DesignToken, Component, designTokens, components } from '../optics-data.js';
import { readToolFile } from '../_internal/resource-path.js';

export type FrameworkType = 'react' | 'vue' | 'svelte' | 'html';

export interface StickerSheetOptions {
  framework?: FrameworkType;
  includeColors?: boolean;
  includeTypography?: boolean;
  includeComponents?: boolean;
}

export interface StickerSheet {
  framework: FrameworkType;
  code: string;
  styles: string;
  instructions: string;
}

class GenerateStickerSheetTool extends Tool {
  name = 'generate_sticker_sheet';
  title = 'Generate Sticker Sheet';
  description = 'Generate a visual style guide with color swatches and component examples';

  inputSchema = {
    framework: z.enum(['react', 'vue', 'svelte', 'html']).optional().describe('Target framework (default: react)'),
    includeColors: z.boolean().optional().describe('Include color swatches (default: true)'),
    includeTypography: z.boolean().optional().describe('Include typography specimens (default: true)'),
    includeComponents: z.boolean().optional().describe('Include component examples (default: true)'),
  };

  async handler(args: any): Promise<string> {
    const { framework, includeColors, includeTypography, includeComponents } = args;
    const options = {
      framework: framework ?? 'react',
      includeColors: includeColors ?? true,
      includeTypography: includeTypography ?? true,
      includeComponents: includeComponents ?? true,
    };
    const sheet = await this.generateStickerSheet(designTokens, components, options);
    const formatted = this.formatStickerSheet(sheet);

    return formatted;
  }

  /**
   * Generate color swatch component
   */
  private generateColorSwatches(tokens: DesignToken[], framework: FrameworkType): string {
    const colors = tokens.filter(t => t.category === 'color');

    const swatchesData = colors.map(token => ({
      name: token.name,
      value: token.value,
      hsl: token.name.startsWith('color-') ? `var(--op-${token.name.replace('color-', '')}-h) var(--op-${token.name.replace('color-', '')}-s) var(--op-${token.name.replace('color-', '')}-l)` : token.value
    }));

    switch (framework) {
      case 'react':
        return `
export function ColorSwatches() {
  const colors = ${JSON.stringify(swatchesData, null, 2)};

  return (
    <div className="color-swatches">
      <h2>Color Palette</h2>
      <div className="swatch-grid">
        {colors.map(color => (
          <div key={color.name} className="swatch-card">
            <div
              className="swatch-preview"
              style={{ backgroundColor: color.value }}
            />
            <div className="swatch-info">
              <strong>{color.name}</strong>
              <code>{color.value}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

      case 'vue':
        return `
<template>
  <div class="color-swatches">
    <h2>Color Palette</h2>
    <div class="swatch-grid">
      <div v-for="color in colors" :key="color.name" class="swatch-card">
        <div
          class="swatch-preview"
          :style="{ backgroundColor: color.value }"
        />
        <div class="swatch-info">
          <strong>{{ color.name }}</strong>
          <code>{{ color.value }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const colors = ${JSON.stringify(swatchesData, null, 2)};
</script>`;

      case 'svelte':
        return `
<script>
  const colors = ${JSON.stringify(swatchesData, null, 2)};
</script>

<div class="color-swatches">
  <h2>Color Palette</h2>
  <div class="swatch-grid">
    {#each colors as color}
      <div class="swatch-card">
        <div
          class="swatch-preview"
          style="background-color: {color.value}"
        />
        <div class="swatch-info">
          <strong>{color.name}</strong>
          <code>{color.value}</code>
        </div>
      </div>
    {/each}
  </div>
</div>`;

      case 'html':
        return `
<div class="color-swatches">
  <h2>Color Palette</h2>
  <div class="swatch-grid">
    ${swatchesData.map(color => `
    <div class="swatch-card">
      <div class="swatch-preview" style="background-color: ${color.value}"></div>
      <div class="swatch-info">
        <strong>${color.name}</strong>
        <code>${color.value}</code>
      </div>
    </div>`).join('\n    ')}
  </div>
</div>`;
    }
  }

  /**
   * Generate typography specimens
   */
  private generateTypographySpecimens(tokens: DesignToken[], framework: FrameworkType): string {
    const fontSizes = tokens.filter(t => t.name.includes('font-size'));
    const fontWeights = tokens.filter(t => t.name.includes('font-weight'));

    switch (framework) {
      case 'react':
        return `
export function TypographySpecimens() {
  return (
    <div className="typography-specimens">
      <h2>Typography Scale</h2>
      ${fontSizes.map(token => `
      <div className="type-specimen" style={{ fontSize: 'var(--${token.name})' }}>
        <span className="type-label">${token.name}</span>
        <span className="type-sample">The quick brown fox jumps over the lazy dog</span>
      </div>`).join('\n      ')}

      <h2>Font Weights</h2>
      ${fontWeights.slice(0, 4).map(token => `
      <p style={{ fontWeight: 'var(--${token.name})' }}>
        ${token.name}: The quick brown fox jumps over the lazy dog
      </p>`).join('\n      ')}
    </div>
  );
}`;

      case 'vue':
        return `
<template>
  <div class="typography-specimens">
    <h2>Typography Scale</h2>
    ${fontSizes.map(token => `
    <div class="type-specimen" :style="{ fontSize: 'var(--${token.name})' }">
      <span class="type-label">${token.name}</span>
      <span class="type-sample">The quick brown fox jumps over the lazy dog</span>
    </div>`).join('\n    ')}

    <h2>Font Weights</h2>
    ${fontWeights.slice(0, 4).map(token => `
    <p :style="{ fontWeight: 'var(--${token.name})' }">
      ${token.name}: The quick brown fox jumps over the lazy dog
    </p>`).join('\n    ')}
  </div>
</template>`;

      case 'svelte':
        return `
<div class="typography-specimens">
  <h2>Typography Scale</h2>
  ${fontSizes.map(token => `
  <div class="type-specimen" style="font-size: var(--${token.name})">
    <span class="type-label">${token.name}</span>
    <span class="type-sample">The quick brown fox jumps over the lazy dog</span>
  </div>`).join('\n  ')}

  <h2>Font Weights</h2>
  ${fontWeights.slice(0, 4).map(token => `
  <p style="font-weight: var(--${token.name})">
    ${token.name}: The quick brown fox jumps over the lazy dog
  </p>`).join('\n  ')}
</div>`;

      case 'html':
        return `
<div class="typography-specimens">
  <h2>Typography Scale</h2>
  ${fontSizes.map(token => `
  <div class="type-specimen" style="font-size: var(--${token.name})">
    <span class="type-label">${token.name}</span>
    <span class="type-sample">The quick brown fox jumps over the lazy dog</span>
  </div>`).join('\n  ')}

  <h2>Font Weights</h2>
  ${fontWeights.slice(0, 4).map(token => `
  <p style="font-weight: var(--${token.name})">
    ${token.name}: The quick brown fox jumps over the lazy dog
  </p>`).join('\n  ')}
</div>`;
    }
  }

  /**
   * Generate component examples
   */
  private generateComponentExamples(components: Component[], framework: FrameworkType): string {
    switch (framework) {
      case 'react':
        return `
export function ComponentExamples() {
  return (
    <div className="component-examples">
      <h2>Components</h2>
      ${components.map(comp => `
      <div className="component-example">
        <h3>${comp.name}</h3>
        <p className="component-description">${comp.description}</p>
        <div className="component-demo">
          {/* Add your ${comp.name} component here */}
          <div className="placeholder">${comp.name} Demo</div>
        </div>
        <div className="component-tokens">
          <strong>Uses tokens:</strong>
          <ul>
            ${comp.tokens.slice(0, 5).map(t => `<li><code>${t}</code></li>`).join('\n            ')}
          </ul>
        </div>
      </div>`).join('\n      ')}
    </div>
  );
}`;

      default:
        return `
<div class="component-examples">
  <h2>Components</h2>
  ${components.map(comp => `
  <div class="component-example">
    <h3>${comp.name}</h3>
    <p class="component-description">${comp.description}</p>
    <div class="component-demo">
      <!-- Add your ${comp.name} component here -->
      <div class="placeholder">${comp.name} Demo</div>
    </div>
    <div class="component-tokens">
      <strong>Uses tokens:</strong>
      <ul>
        ${comp.tokens.slice(0, 5).map(t => `<li><code>${t}</code></li>`).join('\n        ')}
      </ul>
    </div>
  </div>`).join('\n  ')}
</div>`;
    }
  }

  /**
   * Generate CSS styles for sticker sheet
   */
  private generateStyles(): string {
    return `
/* Sticker Sheet Styles */
.color-swatches,
.typography-specimens,
.component-examples {
  padding: var(--op-space-x-large, 2rem);
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-size: var(--op-font-x-large, 2rem);
  font-weight: var(--op-font-weight-bold, 700);
  margin-bottom: var(--op-space-large, 1.5rem);
  color: var(--op-color-neutral-minus-max, #000);
}

/* Color Swatches */
.swatch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--op-space-medium, 1rem);
  margin-bottom: var(--op-space-3x-large, 3rem);
}

.swatch-card {
  border: 1px solid var(--op-color-neutral-plus-five, #e5e5e5);
  border-radius: var(--op-radius-medium, 4px);
  overflow: hidden;
  background: white;
}

.swatch-preview {
  height: 100px;
  width: 100%;
}

.swatch-info {
  padding: var(--op-space-small, 0.75rem);
}

.swatch-info strong {
  display: block;
  font-size: var(--op-font-small, 0.875rem);
  margin-bottom: var(--op-space-2x-small, 0.25rem);
  color: var(--op-color-neutral-minus-two, #333);
}

.swatch-info code {
  font-size: var(--op-font-x-small, 0.75rem);
  color: var(--op-color-neutral-plus-one, #666);
  font-family: var(--op-font-family-mono, monospace);
}

/* Typography Specimens */
.type-specimen {
  padding: var(--op-space-medium, 1rem);
  border-bottom: 1px solid var(--op-color-neutral-plus-six, #f0f0f0);
  margin-bottom: var(--op-space-small, 0.75rem);
}

.type-label {
  display: inline-block;
  font-size: var(--op-font-small, 0.875rem);
  color: var(--op-color-neutral-plus-one, #666);
  min-width: 150px;
  font-family: var(--op-font-family-mono, monospace);
}

.type-sample {
  color: var(--op-color-neutral-minus-max, #000);
}

/* Component Examples */
.component-example {
  margin-bottom: var(--op-space-3x-large, 3rem);
  padding: var(--op-space-large, 1.5rem);
  border: 1px solid var(--op-color-neutral-plus-five, #e5e5e5);
  border-radius: var(--op-radius-large, 8px);
}

.component-example h3 {
  margin-top: 0;
  color: var(--op-color-primary-base, #1a73e8);
}

.component-description {
  color: var(--op-color-neutral-plus-one, #666);
  margin-bottom: var(--op-space-medium, 1rem);
}

.component-demo {
  padding: var(--op-space-x-large, 2rem);
  background: var(--op-color-neutral-plus-eight, #fafafa);
  border-radius: var(--op-radius-medium, 4px);
  margin-bottom: var(--op-space-medium, 1rem);
}

.placeholder {
  padding: var(--op-space-large, 1.5rem);
  background: white;
  border: 2px dashed var(--op-color-neutral-plus-four, #ccc);
  border-radius: var(--op-radius-medium, 4px);
  text-align: center;
  color: var(--op-color-neutral-plus-one, #666);
}

.component-tokens {
  font-size: var(--op-font-small, 0.875rem);
}

.component-tokens ul {
  margin: var(--op-space-small, 0.75rem) 0 0;
  padding-left: var(--op-space-large, 1.5rem);
}

.component-tokens code {
  font-family: var(--op-font-family-mono, monospace);
  background: var(--op-color-neutral-plus-seven, #f5f5f5);
  padding: 2px 6px;
  border-radius: var(--op-radius-small, 2px);
}
`;
  }

  /**
   * Generate complete sticker sheet
   */
  private async generateStickerSheet(
    tokens: DesignToken[],
    components: Component[],
    options: StickerSheetOptions = {}
  ): Promise<StickerSheet> {
    const {
      framework = 'react',
      includeColors = true,
      includeTypography = true,
      includeComponents = true
    } = options;

    const sections: string[] = [];

    if (includeColors) {
      sections.push(this.generateColorSwatches(tokens, framework));
    }

    if (includeTypography) {
      sections.push(this.generateTypographySpecimens(tokens, framework));
    }

    if (includeComponents) {
      sections.push(this.generateComponentExamples(components, framework));
    }

    const code = sections.join('\n\n');
    const styles = this.generateStyles();

    const template = await readToolFile('generate-sticker-sheet-instructions.md');
    const instructions = template
      .replace('{{framework}}', framework.toUpperCase())
      .replace(/{{framework}}/g, framework);

    return {
      framework,
      code,
      styles,
      instructions
    };
  }

  /**
   * Format sticker sheet output for display
   */
  private formatStickerSheet(sheet: StickerSheet): string {
    return `${sheet.instructions}

## Component Code (${sheet.framework})

\`\`\`${sheet.framework === 'html' ? 'html' : sheet.framework === 'vue' ? 'vue' : 'tsx'}
${sheet.code}
\`\`\`

## Styles (CSS)

\`\`\`css
${sheet.styles}
\`\`\`
`;
  }

}

export default GenerateStickerSheetTool;
