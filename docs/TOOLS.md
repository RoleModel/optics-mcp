# Optics MCP Tools Documentation

Complete guide to all tools available in the Optics MCP Server.

## Table of Contents

- [Core Tools](#core-tools)
  - [get_token](#get_token)
  - [search_tokens](#search_tokens)
  - [get_token_usage_stats](#get_token_usage_stats)
  - [get_component_info](#get_component_info)
  - [list_components](#list_components)
  - [get_component_tokens](#get_component_tokens)
  - [search_documentation](#search_documentation)
- [Advanced Tools](#advanced-tools)
  - [generate_theme](#generate_theme)
  - [validate_token_usage](#validate_token_usage)
  - [replace_hard_coded_values](#replace_hard_coded_values)
  - [check_contrast](#check_contrast)
  - [suggest_token_migration](#suggest_token_migration)
  - [generate_component_scaffold](#generate_component_scaffold)
  - [generate_sticker_sheet](#generate_sticker_sheet)

---

## Core Tools

### get_token

Get detailed information about a specific design token.

**Parameters:**
- `tokenName` (string, required): The name of the token

**Example:**
```
Get the color-primary token
```

**Response:**
```json
{
  "name": "color-primary",
  "value": "#0066CC",
  "category": "color",
  "description": "Primary brand color used for main actions and emphasis"
}
```

**Use Cases:**
- Quick reference for token values
- Verify token existence before using
- Understand token purpose from description

---

### search_tokens

Search for design tokens by category or name pattern.

**Parameters:**
- `category` (string, optional): Filter by category (color, spacing, typography, border, shadow)
- `namePattern` (string, optional): Search pattern for token names (case-insensitive)

**Examples:**

Search by category:
```
Search for all color tokens
```

Search by pattern:
```
Find all tokens with "primary" in the name
```

Combined search:
```
Search for spacing tokens containing "large"
```

**Use Cases:**
- Discover available tokens in a category
- Find related tokens (e.g., all "primary" variants)
- Explore token naming patterns

---

### get_token_usage_stats

Get statistics about design token usage across the system.

**Parameters:** None

**Example:**
```
Get token usage statistics
```

**Response:**
```json
{
  "totalTokens": 40,
  "categories": {
    "color": 10,
    "spacing": 6,
    "typography": 17,
    "border": 4,
    "shadow": 3
  }
}
```

**Use Cases:**
- Overview of the design system scope
- Understand token distribution
- Audit token coverage

---

### get_component_info

Get detailed information about a component including its design token dependencies.

**Parameters:**
- `componentName` (string, required): The name of the component

**Example:**
```
Get information about the Button component
```

**Response:**
```json
{
  "name": "Button",
  "description": "Interactive button component for user actions",
  "tokens": [
    "color-primary",
    "spacing-sm",
    "spacing-md",
    "font-size-md",
    "border-radius-md"
  ],
  "usage": "Use buttons for primary user actions...",
  "examples": [...]
}
```

**Use Cases:**
- Understand component token dependencies
- Reference usage guidelines
- See component examples

---

### list_components

List all available components in the design system.

**Parameters:** None

**Example:**
```
List all components
```

**Response:**
```json
[
  {
    "name": "Button",
    "description": "Interactive button component",
    "tokenCount": 8
  },
  {
    "name": "Card",
    "description": "Container component for grouping content",
    "tokenCount": 6
  }
]
```

**Use Cases:**
- Discover available components
- Component inventory
- Quick overview of component library

---

### get_component_tokens

Get all design tokens used by a specific component.

**Parameters:**
- `componentName` (string, required): The name of the component

**Example:**
```
What tokens does the Alert component use?
```

**Response:**
```json
{
  "component": "Alert",
  "description": "Notification component for important messages",
  "tokenCount": 7,
  "tokens": [
    {
      "name": "color-success",
      "value": "#28A745",
      "category": "color"
    },
    ...
  ]
}
```

**Use Cases:**
- Understand component styling dependencies
- Plan token changes (impact analysis)
- Reference for custom component creation

---

### search_documentation

Search through Optics documentation.

**Parameters:**
- `query` (string, required): Search query for documentation content

**Example:**
```
Search documentation for "accessibility"
```

**Response:**
```json
[
  {
    "section": "accessibility",
    "title": "Accessibility Guidelines",
    "content": "Accessibility is a core principle of Optics..."
  }
]
```

**Use Cases:**
- Find specific design system guidance
- Locate documentation sections
- Quick reference lookup

---

## Advanced Tools

### generate_theme

Generate a custom theme with CSS variables and Figma Variables JSON.

**Parameters:**
- `brandName` (string, required): Name of the brand/theme
- `primary` (string, required): Primary brand color (hex)
- `secondary` (string, optional): Secondary color (hex)

**Example:**
```
Generate a theme for "Acme Corp" with primary color #FF6600
```

**Output:**
- **CSS Variables**: HSL custom properties (`--op-color-primary-h`, `-s`, `-l`)
- **Figma Variables**: Native Figma Variables JSON
- **Documentation**: Complete token reference
- **Token Count**: 40+ tokens generated

**Use Cases:**
- Quickly create branded themes
- Generate Figma design tokens
- Bootstrap new projects
- Theme customization

**Example CSS Output:**
```css
:root {
  /* Colors (HSL) */
  --op-color-primary-h: 24;
  --op-color-primary-s: 100%;
  --op-color-primary-l: 50%;
  
  /* Spacing */
  --spacing-md: 16px;
  
  /* Typography */
  --font-size-md: 16px;
  ...
}
```

---

### validate_token_usage

Validate code for hard-coded values that should use design tokens.

**Parameters:**
- `code` (string, required): CSS or component code to validate

**Example:**
```
Validate this CSS:
.button {
  background: #0066CC;
  padding: 16px;
  font-size: 14px;
}
```

**Response:**
```markdown
# Token Validation Report

**Status**: ✗ Issues Found
**Issues**: 3
**Values Checked**: 3

## Issues

### hard-coded-value
- **Value**: `#0066CC`
- **Property**: `background`
- **Suggestion**: Consider using token: color-primary (#0066CC)

### hard-coded-value
- **Value**: `16px`
- **Property**: `padding`
- **Suggestion**: Consider using token: spacing-md (16px)
```

**Use Cases:**
- Code review automation
- Enforce design system usage
- Identify token migration opportunities
- Maintain consistency

---

### replace_hard_coded_values

Replace hard-coded values with design tokens.

**Parameters:**
- `code` (string, required): Code containing hard-coded values
- `autofix` (boolean, optional): Whether to automatically fix (default: false)

**Example:**
```
Replace hard-coded values in this CSS with tokens:
.card {
  background: #FFFFFF;
  padding: 16px;
  border-radius: 8px;
}
```

**Response (autofix: false):**
```markdown
# Token Replacement Suggestions

**Replacements Found**: 3

## Suggested Replacements

- Replace `#FFFFFF` with `var(--color-background)`
  Token: color-background
  Property: background

- Replace `16px` with `var(--spacing-md)`
  Token: spacing-md
  Property: padding

- Replace `8px` with `var(--border-radius-md)`
  Token: border-radius-md
  Property: border-radius
```

**Response (autofix: true):**
Returns the fixed code with tokens applied.

**Use Cases:**
- Automated token migration
- Refactoring legacy code
- Onboarding existing projects to design system

---

### check_contrast

Check WCAG contrast ratio between two color tokens.

**Parameters:**
- `foregroundToken` (string, required): Foreground color token name
- `backgroundToken` (string, required): Background color token name

**Example:**
```
Check contrast between color-text-primary and color-background
```

**Response:**
```markdown
# Contrast Check Result

**Foreground**: color-text-primary (`#212529`)
**Background**: color-background (`#FFFFFF`)

**Contrast Ratio**: 16.1:1
**WCAG AA**: ✓ Pass
**WCAG AAA**: ✓ Pass
**Score**: AAA
```

**Use Cases:**
- Accessibility compliance verification
- Color combination validation
- Design system audits
- Component accessibility checks

---

### suggest_token_migration

Suggest design tokens for a hard-coded value.

**Parameters:**
- `value` (string, required): Hard-coded value to find tokens for
- `category` (string, optional): Optional category filter

**Example:**
```
What token should I use for the value "16px"?
```

**Response:**
```markdown
# Token Migration Suggestions

**Input Value**: `16px`

## Suggested Tokens

### spacing-md
- **Value**: `16px`
- **Category**: spacing
- **Similarity**: 100%
- **Reason**: Exact match

### font-size-md
- **Value**: `16px`
- **Category**: typography
- **Similarity**: 100%
- **Reason**: Exact match
```

**Use Cases:**
- Legacy code migration
- Find appropriate tokens for values
- Design system adoption guidance

---

### generate_component_scaffold

Generate a React component scaffold with proper token usage.

**Parameters:**
- `componentName` (string, required): Name of the component
- `description` (string, required): Brief description
- `tokens` (array, required): List of token names to use

**Example:**
```
Generate a scaffold for an Alert component that uses color-success, color-danger, spacing-md, and border-radius-md tokens
```

**Output:**
- **TypeScript Component**: React component with TypeScript types
- **CSS Module**: Styles using design tokens
- **Usage Examples**: Implementation examples

**Example Output:**
```typescript
/**
 * Alert Component
 * Displays important messages to users
 * 
 * Design tokens used:
 * - color-success
 * - color-danger
 * - spacing-md
 * - border-radius-md
 */

import React from 'react';
import styles from './Alert.module.css';

export interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ children, className }) => {
  return (
    <div className={`${styles.alert} ${className || ''}`}>
      {children}
    </div>
  );
};
```

**Use Cases:**
- Quickly prototype new components
- Ensure token usage from the start
- Generate boilerplate with best practices
- Standardize component structure

---

### generate_sticker_sheet

Generate a visual style guide with color swatches and component examples.

**Parameters:**
- `framework` (string, optional): Target framework (react, vue, svelte, html) - default: react
- `includeColors` (boolean, optional): Include color swatches - default: true
- `includeTypography` (boolean, optional): Include typography specimens - default: true
- `includeComponents` (boolean, optional): Include component examples - default: true

**Example:**
```
Generate a React sticker sheet with all sections
```

**Output:**
- **Component Code**: Ready-to-use framework components (8KB+)
- **CSS Styles**: Styled using Optics tokens (3KB+)
- **Instructions**: Usage guide and next steps

**Generated Sections:**
1. **Color Swatches**: Grid of all color tokens with hex values
2. **Typography Specimens**: Font scale and weight examples
3. **Component Examples**: Placeholder components with token references

**Use Cases:**
- Visual design system reference
- Client presentations
- Developer onboarding
- Design handoffs
- Style guide documentation
- Component library documentation

**Example Usage:**
```
Generate a Vue sticker sheet with only colors and typography
```

---

## Tips & Best Practices

### Combining Tools

Tools work great together! Example workflows:

**Workflow: Migrate Legacy Code**
1. `validate_token_usage` - Identify hard-coded values
2. `suggest_token_migration` - Find appropriate tokens
3. `replace_hard_coded_values` - Apply the fixes
4. `check_contrast` - Verify accessibility

**Workflow: Build New Feature**
1. `search_tokens` - Discover available tokens
2. `generate_component_scaffold` - Create component structure
3. `check_contrast` - Validate color combinations
4. `generate_sticker_sheet` - Document the result

**Workflow: Create Brand Theme**
1. `generate_theme` - Create token set
2. `generate_sticker_sheet` - Visual reference
3. `validate_token_usage` - Ensure proper usage

### Token Naming Conventions

Optics uses this naming pattern:
- Colors: `color-{role}` (e.g., `color-primary`, `color-success`)
- Spacing: `spacing-{size}` (e.g., `spacing-sm`, `spacing-lg`)
- Typography: `font-{property}-{value}` (e.g., `font-size-md`, `font-weight-bold`)
- Borders: `border-radius-{size}` (e.g., `border-radius-md`)
- Shadows: `shadow-{size}` (e.g., `shadow-sm`)

### HSL Token Format

Optics themes use HSL custom properties:
```css
--op-color-primary-h: 210;   /* Hue */
--op-color-primary-s: 100%;  /* Saturation */
--op-color-primary-l: 40%;   /* Lightness */
```

These can be composed into colors:
```css
color: hsl(
  var(--op-color-primary-h)
  var(--op-color-primary-s)
  var(--op-color-primary-l)
);
```

This enables easy theme customization by only overriding H/S/L values.

---

## Need Help?

- **Documentation**: [Optics Design System](https://docs.optics.rolemodel.design)
- **Issues**: [GitHub Issues](https://github.com/RoleModel/optics-mcp/issues)
- **Installation**: See [INSTALLATION.md](./INSTALLATION.md)
- **Examples**: See [EXAMPLES.md](./EXAMPLES.md)
