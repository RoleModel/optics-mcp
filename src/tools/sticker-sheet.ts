/**
 * Sticker sheet generator
 * Generates visual style guide with color swatches and component examples
 */

import { DesignToken, Component } from '../optics-data.js';

export type FrameworkType = 'react' | 'vue' | 'svelte' | 'html';

export interface StickerSheetOptions {
  framework?: FrameworkType;
  includeColors?: boolean;
  includeTypography?: boolean;
  includeSpacing?: boolean;
  includeComponents?: boolean;
}

export interface StickerSheet {
  framework: FrameworkType;
  code: string;
  styles: string;
  instructions: string;
}

/**
 * Generate color swatch component
 */
function generateColorSwatches(tokens: DesignToken[], framework: FrameworkType): string {
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
function generateTypographySpecimens(tokens: DesignToken[], framework: FrameworkType): string {
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
function generateComponentExamples(components: Component[], framework: FrameworkType): string {
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

    case 'vue':
      return `
<template>
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
          ${comp.tokens.slice(0, 5).map(t => `<li><code>${t}</code></li>`).join('\n          ')}
        </ul>
      </div>
    </div>`).join('\n    ')}
  </div>
</template>`;

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
function generateStyles(): string {
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
export function generateStickerSheet(
  tokens: DesignToken[],
  components: Component[],
  options: StickerSheetOptions = {}
): StickerSheet {
  const {
    framework = 'react',
    includeColors = true,
    includeTypography = true,
    includeComponents = true
  } = options;
  
  const sections: string[] = [];
  
  if (includeColors) {
    sections.push(generateColorSwatches(tokens, framework));
  }
  
  if (includeTypography) {
    sections.push(generateTypographySpecimens(tokens, framework));
  }
  
  if (includeComponents) {
    sections.push(generateComponentExamples(components, framework));
  }
  
  const code = sections.join('\n\n');
  const styles = generateStyles();
  
  const instructions = `
# Optics Sticker Sheet - ${framework.toUpperCase()}

This sticker sheet provides a visual reference for all Optics design tokens and components.

## Usage

1. Copy the component code below into your ${framework} project
2. Copy the CSS styles into your stylesheet
3. Import and use the components in your app
4. Replace placeholders with actual component implementations

## Files Generated

- **Component Code**: Ready-to-use ${framework} components
- **Styles**: CSS using Optics design tokens
- **Examples**: Visual specimens of colors, typography, and components

## Next Steps

- Customize the examples to match your specific components
- Add interactive states (hover, focus, disabled)
- Include additional token categories as needed
`;
  
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
export function formatStickerSheet(sheet: StickerSheet): string {
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
