/**
 * Optics Design System Data
 * This file contains the core design tokens, components, and documentation
 * structure for the Optics design system.
 */

export interface DesignToken {
  name: string;
  value: string;
  category: string;
  description?: string;
}

export interface Component {
  name: string;
  description: string;
  tokens: string[];
  usage: string;
  examples?: string[];
}

export interface Documentation {
  section: string;
  title: string;
  content: string;
  tokens?: string[];
}

/**
 * Design Tokens - Core visual design elements from Optics Design System
 * Source: https://docs.optics.rolemodel.design
 */
export const designTokens: DesignToken[] = [
  // Base Color HSL Values (These are the foundation - all other colors are derived from these)
  {
    name: 'op-color-primary-h',
    value: '216',
    category: 'color',
    description: 'Primary color hue (HSL)'
  },
  {
    name: 'op-color-primary-s',
    value: '58%',
    category: 'color',
    description: 'Primary color saturation (HSL)'
  },
  {
    name: 'op-color-primary-l',
    value: '48%',
    category: 'color',
    description: 'Primary color lightness (HSL)'
  },
  {
    name: 'op-color-neutral-h',
    value: '216',
    category: 'color',
    description: 'Neutral color hue (HSL, inherits from primary)'
  },
  {
    name: 'op-color-neutral-s',
    value: '4%',
    category: 'color',
    description: 'Neutral color saturation (HSL)'
  },
  {
    name: 'op-color-neutral-l',
    value: '48%',
    category: 'color',
    description: 'Neutral color lightness (HSL)'
  },
  // Alert Colors HSL
  {
    name: 'op-color-alerts-warning-h',
    value: '47',
    category: 'color',
    description: 'Warning alert hue (HSL)'
  },
  {
    name: 'op-color-alerts-warning-s',
    value: '100%',
    category: 'color',
    description: 'Warning alert saturation (HSL)'
  },
  {
    name: 'op-color-alerts-warning-l',
    value: '61%',
    category: 'color',
    description: 'Warning alert lightness (HSL)'
  },
  {
    name: 'op-color-alerts-danger-h',
    value: '0',
    category: 'color',
    description: 'Danger alert hue (HSL)'
  },
  {
    name: 'op-color-alerts-danger-s',
    value: '99%',
    category: 'color',
    description: 'Danger alert saturation (HSL)'
  },
  {
    name: 'op-color-alerts-danger-l',
    value: '76%',
    category: 'color',
    description: 'Danger alert lightness (HSL)'
  },
  {
    name: 'op-color-alerts-info-h',
    value: '216',
    category: 'color',
    description: 'Info alert hue (HSL)'
  },
  {
    name: 'op-color-alerts-info-s',
    value: '58%',
    category: 'color',
    description: 'Info alert saturation (HSL)'
  },
  {
    name: 'op-color-alerts-info-l',
    value: '48%',
    category: 'color',
    description: 'Info alert lightness (HSL)'
  },
  {
    name: 'op-color-alerts-notice-h',
    value: '130',
    category: 'color',
    description: 'Notice alert hue (HSL)'
  },
  {
    name: 'op-color-alerts-notice-s',
    value: '61%',
    category: 'color',
    description: 'Notice alert saturation (HSL)'
  },
  {
    name: 'op-color-alerts-notice-l',
    value: '64%',
    category: 'color',
    description: 'Notice alert lightness (HSL)'
  },
  // Core semantic colors (most commonly used)
  {
    name: 'op-color-white',
    value: 'hsl(0deg 100% 100%)',
    category: 'color',
    description: 'Pure white'
  },
  {
    name: 'op-color-black',
    value: 'hsl(0deg 0% 0%)',
    category: 'color',
    description: 'Pure black'
  },

  // Spacing Tokens
  {
    name: 'op-space-scale-unit',
    value: '1rem',
    category: 'spacing',
    description: 'Base unit for spacing scale (10px)'
  },
  {
    name: 'op-space-3x-small',
    value: 'calc(var(--op-space-scale-unit) * 0.2)',
    category: 'spacing',
    description: '2px spacing'
  },
  {
    name: 'op-space-2x-small',
    value: 'calc(var(--op-space-scale-unit) * 0.4)',
    category: 'spacing',
    description: '4px spacing'
  },
  {
    name: 'op-space-x-small',
    value: 'calc(var(--op-space-scale-unit) * 0.8)',
    category: 'spacing',
    description: '8px spacing'
  },
  {
    name: 'op-space-small',
    value: 'calc(var(--op-space-scale-unit) * 1.2)',
    category: 'spacing',
    description: '12px spacing'
  },
  {
    name: 'op-space-medium',
    value: 'calc(var(--op-space-scale-unit) * 1.6)',
    category: 'spacing',
    description: '16px spacing'
  },
  {
    name: 'op-space-large',
    value: 'calc(var(--op-space-scale-unit) * 2)',
    category: 'spacing',
    description: '20px spacing'
  },
  {
    name: 'op-space-x-large',
    value: 'calc(var(--op-space-scale-unit) * 2.4)',
    category: 'spacing',
    description: '24px spacing'
  },
  {
    name: 'op-space-2x-large',
    value: 'calc(var(--op-space-scale-unit) * 2.8)',
    category: 'spacing',
    description: '28px spacing'
  },
  {
    name: 'op-space-3x-large',
    value: 'calc(var(--op-space-scale-unit) * 4)',
    category: 'spacing',
    description: '40px spacing'
  },
  {
    name: 'op-space-4x-large',
    value: 'calc(var(--op-space-scale-unit) * 8)',
    category: 'spacing',
    description: '80px spacing'
  },

  // Typography Tokens - Font Family
  {
    name: 'op-font-family',
    value: "'Noto Sans', 'Noto Serif', sans-serif",
    category: 'typography',
    description: 'Font family for all text'
  },

  // Font Sizes
  {
    name: 'op-font-scale-unit',
    value: '1rem',
    category: 'typography',
    description: 'Base unit for font scale (10px)'
  },
  {
    name: 'op-font-2x-small',
    value: 'calc(var(--op-font-scale-unit) * 1)',
    category: 'typography',
    description: '10px font size'
  },
  {
    name: 'op-font-x-small',
    value: 'calc(var(--op-font-scale-unit) * 1.2)',
    category: 'typography',
    description: '12px font size'
  },
  {
    name: 'op-font-small',
    value: 'calc(var(--op-font-scale-unit) * 1.4)',
    category: 'typography',
    description: '14px font size'
  },
  {
    name: 'op-font-medium',
    value: 'calc(var(--op-font-scale-unit) * 1.6)',
    category: 'typography',
    description: '16px font size'
  },
  {
    name: 'op-font-large',
    value: 'calc(var(--op-font-scale-unit) * 1.8)',
    category: 'typography',
    description: '18px font size'
  },
  {
    name: 'op-font-x-large',
    value: 'calc(var(--op-font-scale-unit) * 2)',
    category: 'typography',
    description: '20px font size'
  },
  {
    name: 'op-font-2x-large',
    value: 'calc(var(--op-font-scale-unit) * 2.4)',
    category: 'typography',
    description: '24px font size'
  },
  {
    name: 'op-font-3x-large',
    value: 'calc(var(--op-font-scale-unit) * 2.8)',
    category: 'typography',
    description: '28px font size'
  },
  {
    name: 'op-font-4x-large',
    value: 'calc(var(--op-font-scale-unit) * 3.2)',
    category: 'typography',
    description: '32px font size'
  },
  {
    name: 'op-font-5x-large',
    value: 'calc(var(--op-font-scale-unit) * 3.6)',
    category: 'typography',
    description: '36px font size'
  },
  {
    name: 'op-font-6x-large',
    value: 'calc(var(--op-font-scale-unit) * 4.8)',
    category: 'typography',
    description: '48px font size'
  },

  // Font Weights
  {
    name: 'op-font-weight-thin',
    value: '100',
    category: 'typography',
    description: 'Thin font weight'
  },
  {
    name: 'op-font-weight-extra-light',
    value: '200',
    category: 'typography',
    description: 'Extra light font weight'
  },
  {
    name: 'op-font-weight-light',
    value: '300',
    category: 'typography',
    description: 'Light font weight'
  },
  {
    name: 'op-font-weight-normal',
    value: '400',
    category: 'typography',
    description: 'Normal font weight'
  },
  {
    name: 'op-font-weight-medium',
    value: '500',
    category: 'typography',
    description: 'Medium font weight'
  },
  {
    name: 'op-font-weight-semi-bold',
    value: '600',
    category: 'typography',
    description: 'Semi-bold font weight'
  },
  {
    name: 'op-font-weight-bold',
    value: '700',
    category: 'typography',
    description: 'Bold font weight'
  },
  {
    name: 'op-font-weight-extra-bold',
    value: '800',
    category: 'typography',
    description: 'Extra bold font weight'
  },
  {
    name: 'op-font-weight-black',
    value: '900',
    category: 'typography',
    description: 'Black font weight'
  },

  // Line Heights
  {
    name: 'op-line-height-none',
    value: '0',
    category: 'typography',
    description: 'No line height'
  },
  {
    name: 'op-line-height-densest',
    value: '1',
    category: 'typography',
    description: 'Densest line height'
  },
  {
    name: 'op-line-height-denser',
    value: '1.15',
    category: 'typography',
    description: 'Denser line height'
  },
  {
    name: 'op-line-height-dense',
    value: '1.3',
    category: 'typography',
    description: 'Dense line height'
  },
  {
    name: 'op-line-height-base',
    value: '1.5',
    category: 'typography',
    description: 'Base line height'
  },
  {
    name: 'op-line-height-loose',
    value: '1.6',
    category: 'typography',
    description: 'Loose line height'
  },
  {
    name: 'op-line-height-looser',
    value: '1.7',
    category: 'typography',
    description: 'Looser line height'
  },
  {
    name: 'op-line-height-loosest',
    value: '1.8',
    category: 'typography',
    description: 'Loosest line height'
  },

  // Letter Spacing
  {
    name: 'op-letter-spacing-navigation',
    value: '0.01rem',
    category: 'typography',
    description: 'Letter spacing for navigation'
  },
  {
    name: 'op-letter-spacing-label',
    value: '0.04rem',
    category: 'typography',
    description: 'Letter spacing for labels'
  },

  // Border Radius Tokens
  {
    name: 'op-radius-small',
    value: '2px',
    category: 'border',
    description: 'Small border radius'
  },
  {
    name: 'op-radius-medium',
    value: '4px',
    category: 'border',
    description: 'Medium border radius'
  },
  {
    name: 'op-radius-large',
    value: '8px',
    category: 'border',
    description: 'Large border radius'
  },
  {
    name: 'op-radius-x-large',
    value: '12px',
    category: 'border',
    description: 'Extra large border radius'
  },
  {
    name: 'op-radius-2x-large',
    value: '16px',
    category: 'border',
    description: '2X large border radius'
  },
  {
    name: 'op-radius-circle',
    value: '50%',
    category: 'border',
    description: 'Circular border radius'
  },
  {
    name: 'op-radius-pill',
    value: '9999px',
    category: 'border',
    description: 'Pill-shaped border radius'
  },

  // Border Width Tokens
  {
    name: 'op-border-width',
    value: '1px',
    category: 'border',
    description: 'Standard border width'
  },
  {
    name: 'op-border-width-large',
    value: '2px',
    category: 'border',
    description: 'Large border width'
  },
  {
    name: 'op-border-width-x-large',
    value: '4px',
    category: 'border',
    description: 'Extra large border width'
  },

  // Shadow Tokens
  {
    name: 'op-shadow-x-small',
    value: '0 1px 2px hsl(0deg 0% 0% / 3%), 0 1px 3px hsl(0deg 0% 0% / 15%)',
    category: 'shadow',
    description: 'Extra small shadow'
  },
  {
    name: 'op-shadow-small',
    value: '0 1px 2px hsl(0deg 0% 0% / 3%), 0 2px 6px hsl(0deg 0% 0% / 15%)',
    category: 'shadow',
    description: 'Small shadow'
  },
  {
    name: 'op-shadow-medium',
    value: '0 4px 8px hsl(0deg 0% 0% / 15%), 0 1px 3px hsl(0deg 0% 0% / 3%)',
    category: 'shadow',
    description: 'Medium shadow'
  },
  {
    name: 'op-shadow-large',
    value: '0 6px 10px hsl(0deg 0% 0% / 15%), 0 2px 3px hsl(0deg 0% 0% / 3%)',
    category: 'shadow',
    description: 'Large shadow'
  },
  {
    name: 'op-shadow-x-large',
    value: '0 8px 12px hsl(0deg 0% 0% / 15%), 0 4px 4px hsl(0deg 0% 0% / 3%)',
    category: 'shadow',
    description: 'Extra large shadow'
  },

  // Opacity Tokens
  {
    name: 'op-opacity-none',
    value: '0',
    category: 'color',
    description: 'No opacity'
  },
  {
    name: 'op-opacity-overlay',
    value: '0.2',
    category: 'color',
    description: 'Overlay opacity'
  },
  {
    name: 'op-opacity-disabled',
    value: '0.4',
    category: 'color',
    description: 'Disabled opacity'
  },
  {
    name: 'op-opacity-half',
    value: '0.5',
    category: 'color',
    description: 'Half opacity'
  },
  {
    name: 'op-opacity-full',
    value: '1',
    category: 'color',
    description: 'Full opacity'
  }
];

/**
 * Components - Reusable UI components with their design token usage
 * Real components from the Optics Design System
 */
export const components: Component[] = [
  {
    name: 'Accordion',
    description: 'Collapsible content panel with expand/collapse animation',
    tokens: [
      '--op-color-neutral-on-plus-max',
      '--op-font-weight-semi-bold',
      '--op-font-x-large',
      '--op-font-x-small',
      '--op-mso-optical-sizing',
      '--op-size-unit',
      '--op-space-2x-small',
      '--op-transition-accordion'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Alert',
    description: 'Notification component for displaying important messages (warning, danger, info, notice)',
    tokens: [
      '--op-animation-flash',
      '--op-border-all',
      '--op-color-alerts-danger-base',
      '--op-color-alerts-danger-on-base',
      '--op-color-alerts-danger-on-base-alt',
      '--op-color-alerts-danger-on-plus-eight',
      '--op-color-alerts-danger-on-plus-eight-alt',
      '--op-color-alerts-danger-on-plus-five',
      '--op-color-alerts-danger-on-plus-five-alt',
      '--op-color-alerts-danger-plus-eight',
      '--op-color-alerts-danger-plus-five',
      '--op-color-alerts-info-base',
      '--op-color-alerts-info-on-base',
      '--op-color-alerts-info-on-base-alt',
      '--op-color-alerts-info-on-plus-eight',
      '--op-color-alerts-info-on-plus-eight-alt',
      '--op-color-alerts-info-on-plus-five',
      '--op-color-alerts-info-on-plus-five-alt',
      '--op-color-alerts-info-plus-eight',
      '--op-color-alerts-info-plus-five',
      '--op-color-alerts-notice-base',
      '--op-color-alerts-notice-on-base',
      '--op-color-alerts-notice-on-base-alt',
      '--op-color-alerts-notice-on-plus-eight',
      '--op-color-alerts-notice-on-plus-eight-alt',
      '--op-color-alerts-notice-on-plus-five',
      '--op-color-alerts-notice-on-plus-five-alt',
      '--op-color-alerts-notice-plus-eight',
      '--op-color-alerts-notice-plus-five',
      '--op-color-alerts-warning-base',
      '--op-color-alerts-warning-on-base',
      '--op-color-alerts-warning-on-base-alt',
      '--op-color-alerts-warning-on-plus-eight',
      '--op-color-alerts-warning-on-plus-eight-alt',
      '--op-color-alerts-warning-on-plus-five',
      '--op-color-alerts-warning-on-plus-five-alt',
      '--op-color-alerts-warning-plus-eight',
      '--op-color-alerts-warning-plus-five',
      '--op-font-medium',
      '--op-font-small',
      '--op-font-weight-medium',
      '--op-line-height-dense',
      '--op-radius-medium',
      '--op-space-2x-small',
      '--op-space-large',
      '--op-space-medium',
      '--op-space-small',
      '--op-space-x-small',
      '--op-z-index-alert-group'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Avatar',
    description: 'User profile picture component with multiple sizes and states',
    tokens: [
      '--op-border-width',
      '--op-border-width-large',
      '--op-color-neutral-base',
      '--op-color-neutral-minus-max',
      '--op-color-primary-base',
      '--op-color-primary-plus-one',
      '--op-opacity-disabled',
      '--op-opacity-overlay',
      '--op-radius-circle',
      '--op-size-unit'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Badge',
    description: 'Small status indicator or label with multiple color variants',
    tokens: [
      '--op-border-width-large',
      '--op-color-alerts-danger-base',
      '--op-color-alerts-danger-on-base',
      '--op-color-alerts-info-base',
      '--op-color-alerts-info-on-base',
      '--op-color-alerts-notice-base',
      '--op-color-alerts-notice-on-base',
      '--op-color-alerts-warning-base',
      '--op-color-alerts-warning-on-base',
      '--op-color-neutral-base',
      '--op-color-neutral-on-base',
      '--op-color-neutral-plus-max',
      '--op-color-primary-base',
      '--op-color-primary-on-base',
      '--op-font-small',
      '--op-font-weight-bold',
      '--op-font-x-small',
      '--op-letter-spacing-label',
      '--op-line-height-dense',
      '--op-radius-medium',
      '--op-radius-pill',
      '--op-space-2x-small',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Breadcrumbs',
    description: 'Navigation component showing the current page location in the site hierarchy',
    tokens: [
      '--op-font-small',
      '--op-font-weight-bold',
      '--op-font-x-small',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Button',
    description: 'Interactive button component with multiple variants (primary, secondary, etc.) and states',
    tokens: [
      '--op-border-all',
      '--op-color-alerts-danger-base',
      '--op-color-alerts-danger-minus-two',
      '--op-color-alerts-danger-on-base',
      '--op-color-alerts-danger-on-minus-two',
      '--op-color-alerts-danger-on-plus-five',
      '--op-color-alerts-danger-plus-five',
      '--op-color-alerts-danger-plus-three',
      '--op-color-alerts-warning-base',
      '--op-color-alerts-warning-minus-two',
      '--op-color-alerts-warning-on-base',
      '--op-color-alerts-warning-on-minus-two',
      '--op-color-alerts-warning-on-plus-five',
      '--op-color-alerts-warning-plus-five',
      '--op-color-alerts-warning-plus-three',
      '--op-color-neutral-on-plus-eight',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-four',
      '--op-color-primary-base',
      '--op-color-primary-minus-five',
      '--op-color-primary-on-base',
      '--op-color-primary-on-minus-five',
      '--op-color-primary-on-plus-eight',
      '--op-color-primary-on-plus-five',
      '--op-color-primary-on-plus-max',
      '--op-color-primary-on-plus-one',
      '--op-color-primary-plus-eight',
      '--op-color-primary-plus-five',
      '--op-color-primary-plus-one',
      '--op-color-primary-plus-three',
      '--op-color-primary-plus-two',
      '--op-font-small',
      '--op-font-weight-normal',
      '--op-font-x-small',
      '--op-input-focus-danger',
      '--op-input-focus-primary',
      '--op-input-focus-warning',
      '--op-input-height-large',
      '--op-input-height-medium',
      '--op-input-height-small',
      '--op-opacity-disabled',
      '--op-radius-medium',
      '--op-radius-pill',
      '--op-space-3x-small',
      '--op-space-small',
      '--op-space-x-small',
      '--op-transition-input'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'ButtonGroup',
    description: 'Container for grouping related buttons together',
    tokens: [
      '--op-btn-group-active-z-index',
      '--op-btn-group-focus-z-index',
      '--op-btn-group-hover-z-index'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Card',
    description: 'Container component for grouping related content with optional header, body, and footer',
    tokens: [
      '--op-border-all',
      '--op-color-background',
      '--op-color-border',
      '--op-color-on-background',
      '--op-font-medium',
      '--op-line-height-base',
      '--op-radius-medium',
      '--op-shadow-large',
      '--op-shadow-medium',
      '--op-shadow-small',
      '--op-shadow-x-large',
      '--op-shadow-x-small',
      '--op-space-medium',
      '--op-space-scale-unit'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'ConfirmDialog',
    description: 'Modal dialog for confirming user actions',
    tokens: [
      '--op-border-all',
      '--op-color-background',
      '--op-color-black',
      '--op-color-border',
      '--op-color-on-background',
      '--op-font-large',
      '--op-font-medium',
      '--op-font-weight-semi-bold',
      '--op-line-height-base',
      '--op-opacity-full',
      '--op-opacity-half',
      '--op-opacity-none',
      '--op-radius-medium',
      '--op-size-unit',
      '--op-space-medium',
      '--op-transition-modal',
      '--op-z-index-dialog',
      '--op-z-index-dialog-backdrop',
      '--op-z-index-dialog-content'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Divider',
    description: 'Visual separator between content sections',
    tokens: [
      '--op-border-width',
      '--op-border-width-large',
      '--op-border-width-x-large',
      '--op-color-border',
      '--op-space-2x-small',
      '--op-space-large',
      '--op-space-medium',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Form',
    description: 'Form input components including text inputs, textareas, selects, and labels',
    tokens: [
      '--op-border-all',
      '--op-border-bottom',
      '--op-color-alerts-danger-base',
      '--op-color-alerts-danger-minus-three',
      '--op-color-alerts-danger-minus-two',
      '--op-color-alerts-danger-on-plus-eight',
      '--op-color-alerts-danger-on-plus-seven',
      '--op-color-alerts-danger-plus-eight',
      '--op-color-alerts-danger-plus-seven',
      '--op-color-neutral-on-plus-eight',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-four',
      '--op-color-on-background',
      '--op-color-primary-base',
      '--op-color-primary-on-plus-eight',
      '--op-color-primary-on-plus-max',
      '--op-color-primary-on-plus-seven',
      '--op-color-primary-plus-eight',
      '--op-color-primary-plus-seven',
      '--op-color-primary-plus-three',
      '--op-color-primary-plus-two',
      '--op-encoded-images-dropdown-arrow',
      '--op-encoded-images-dropdown-arrow-width',
      '--op-font-medium',
      '--op-font-small',
      '--op-font-weight-bold',
      '--op-font-weight-normal',
      '--op-font-x-small',
      '--op-input-focus-danger',
      '--op-input-focus-primary',
      '--op-input-height-large',
      '--op-input-height-medium',
      '--op-input-height-small',
      '--op-letter-spacing-label',
      '--op-line-height-base',
      '--op-opacity-disabled',
      '--op-radius-large',
      '--op-radius-medium',
      '--op-space-2x-small',
      '--op-space-3x-large',
      '--op-space-large',
      '--op-space-medium',
      '--op-space-small',
      '--op-space-x-large',
      '--op-space-x-small',
      '--op-transition-input'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Icon',
    description: 'Material Symbols icon component',
    tokens: [
      '--op-font-2x-large',
      '--op-font-3x-large',
      '--op-font-large',
      '--op-font-medium',
      '--op-font-small',
      '--op-font-weight-bold',
      '--op-font-weight-light',
      '--op-font-weight-normal',
      '--op-font-weight-semi-bold',
      '--op-line-height-densest',
      '--op-mso-fill',
      '--op-mso-grade',
      '--op-mso-optical-sizing',
      '--op-mso-weight'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Modal',
    description: 'Dialog component for focused interactions and content overlays',
    tokens: [
      '--op-border-all',
      '--op-color-background',
      '--op-color-black',
      '--op-color-border',
      '--op-color-on-background',
      '--op-font-large',
      '--op-font-medium',
      '--op-font-weight-semi-bold',
      '--op-line-height-base',
      '--op-opacity-full',
      '--op-opacity-half',
      '--op-opacity-none',
      '--op-radius-medium',
      '--op-size-unit',
      '--op-space-medium',
      '--op-space-small',
      '--op-transition-modal',
      '--op-z-index-dialog',
      '--op-z-index-dialog-backdrop',
      '--op-z-index-dialog-content'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Navbar',
    description: 'Top navigation bar component',
    tokens: [
      '--op-border-bottom',
      '--op-color-neutral-on-plus-eight',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-four',
      '--op-color-primary-on-plus-six',
      '--op-color-primary-plus-four',
      '--op-color-primary-plus-six',
      '--op-size-unit',
      '--op-space-2x-small',
      '--op-space-small',
      '--op-space-x-large',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Pagination',
    description: 'Navigation component for paginated content',
    tokens: [
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'SidePanel',
    description: 'Sliding panel from the side of the screen',
    tokens: [
      '--op-border-left',
      '--op-border-right',
      '--op-border-x',
      '--op-color-background',
      '--op-color-border',
      '--op-color-on-background',
      '--op-size-unit',
      '--op-space-medium'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Sidebar',
    description: 'Side navigation panel component',
    tokens: [
      '--op-border-right',
      '--op-color-neutral-on-plus-eight',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-four',
      '--op-color-primary-on-plus-six',
      '--op-color-primary-plus-four',
      '--op-color-primary-plus-six',
      '--op-size-unit',
      '--op-space-2x-large',
      '--op-space-2x-small',
      '--op-space-3x-small',
      '--op-space-medium',
      '--op-space-small',
      '--op-space-x-small',
      '--op-transition-sidebar'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Spinner',
    description: 'Loading indicator component',
    tokens: [
      '--op-border-width',
      '--op-border-width-large',
      '--op-border-width-x-large',
      '--op-color-neutral-plus-four',
      '--op-color-primary-base',
      '--op-size-unit'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Switch',
    description: 'Toggle switch component',
    tokens: [
      '--op-border-all',
      '--op-border-width-large',
      '--op-color-neutral-base',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-five',
      '--op-color-neutral-plus-three',
      '--op-color-primary-base',
      '--op-color-primary-minus-three',
      '--op-color-primary-minus-two',
      '--op-color-primary-plus-five',
      '--op-color-primary-plus-six',
      '--op-opacity-disabled',
      '--op-radius-circle',
      '--op-radius-pill',
      '--op-size-unit',
      '--op-space-2x-small',
      '--op-space-x-small',
      '--op-transition-input'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Tab',
    description: 'Tabbed interface component',
    tokens: [
      '--op-border-width-large',
      '--op-border-width-x-large',
      '--op-color-background',
      '--op-color-on-background',
      '--op-color-primary-base',
      '--op-color-primary-on-plus-seven',
      '--op-color-primary-plus-one',
      '--op-color-primary-plus-seven',
      '--op-font-small',
      '--op-font-x-small',
      '--op-input-focus-primary',
      '--op-opacity-disabled',
      '--op-space-2x-small',
      '--op-space-3x-small',
      '--op-space-medium',
      '--op-space-small',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Table',
    description: 'Data table component for displaying structured information',
    tokens: [
      '--op-border-all',
      '--op-border-top',
      '--op-color-alerts-danger-on-plus-seven',
      '--op-color-alerts-danger-plus-seven',
      '--op-color-border',
      '--op-color-neutral-on-plus-eight',
      '--op-color-neutral-on-plus-max',
      '--op-color-neutral-on-plus-seven',
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-plus-max',
      '--op-color-neutral-plus-seven',
      '--op-color-primary-on-plus-seven',
      '--op-color-primary-plus-seven',
      '--op-font-small',
      '--op-font-weight-semi-bold',
      '--op-radius-medium',
      '--op-size-unit',
      '--op-space-2x-small',
      '--op-space-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Tag',
    description: 'Small label component for categorizing or tagging content',
    tokens: [
      '--op-color-alerts-danger-base',
      '--op-color-alerts-danger-minus-three',
      '--op-color-alerts-danger-on-base',
      '--op-color-alerts-danger-on-minus-three',
      '--op-color-alerts-info-base',
      '--op-color-alerts-info-minus-three',
      '--op-color-alerts-info-on-base',
      '--op-color-alerts-info-on-minus-three',
      '--op-color-alerts-notice-base',
      '--op-color-alerts-notice-minus-three',
      '--op-color-alerts-notice-on-base',
      '--op-color-alerts-notice-on-minus-three',
      '--op-color-alerts-warning-base',
      '--op-color-alerts-warning-minus-three',
      '--op-color-alerts-warning-on-base',
      '--op-color-alerts-warning-on-minus-three',
      '--op-color-neutral-base',
      '--op-color-neutral-minus-three',
      '--op-color-neutral-on-base',
      '--op-color-neutral-on-minus-three',
      '--op-color-neutral-on-plus-four',
      '--op-color-neutral-plus-four',
      '--op-color-primary-base',
      '--op-color-primary-minus-three',
      '--op-color-primary-on-base',
      '--op-color-primary-on-minus-three',
      '--op-font-medium',
      '--op-font-weight-bold',
      '--op-font-x-small',
      '--op-input-focus-danger',
      '--op-input-focus-info',
      '--op-input-focus-neutral',
      '--op-input-focus-notice',
      '--op-input-focus-primary',
      '--op-input-focus-warning',
      '--op-letter-spacing-label',
      '--op-line-height-dense',
      '--op-radius-pill',
      '--op-space-2x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'TextPair',
    description: 'Component for displaying label-value pairs',
    tokens: [
      '--op-font-large',
      '--op-font-medium',
      '--op-font-small',
      '--op-font-weight-normal',
      '--op-font-weight-semi-bold',
      '--op-line-height-dense',
      '--op-space-x-small'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  },
  {
    name: 'Tooltip',
    description: 'Contextual information component that appears on hover or focus',
    tokens: [
      '--op-color-neutral-minus-max',
      '--op-color-neutral-on-minus-max',
      '--op-font-family',
      '--op-font-small',
      '--op-opacity-full',
      '--op-opacity-none',
      '--op-radius-medium',
      '--op-size-unit',
      '--op-space-medium',
      '--op-space-small',
      '--op-space-x-small',
      '--op-transition-tooltip',
      '--op-z-index-tooltip'
    ],
    usage: 'See https://docs.optics.rolemodel.design for component usage and examples',
    examples: []
  }
];

/**
 * Documentation - Organized documentation sections
 */
export const documentation: Documentation[] = [
  {
    section: 'introduction',
    title: 'Introduction to Optics',
    content: 'Optics is a comprehensive design system that provides a consistent visual language and component library for building user interfaces. It includes design tokens, components, patterns, and guidelines to ensure consistency across all RoleModel products.',
    tokens: []
  },
  {
    section: 'getting-started',
    title: 'Getting Started',
    content: 'To get started with Optics, install the design system package and import the tokens and components you need. The system is built with modularity in mind, allowing you to use only what you need.',
    tokens: []
  },
  {
    section: 'design-tokens',
    title: 'Design Tokens',
    content: 'Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes. They are used in place of hard-coded values to ensure consistency and enable theming.',
    tokens: designTokens.map(t => t.name)
  },
  {
    section: 'color-system',
    title: 'Color System',
    content: 'The Optics color system provides a comprehensive palette designed for accessibility and visual harmony. Use semantic color tokens (primary, secondary, success, danger, warning, info) rather than specific color values.',
    tokens: designTokens.filter(t => t.category === 'color').map(t => t.name)
  },
  {
    section: 'spacing',
    title: 'Spacing System',
    content: 'Consistent spacing creates visual rhythm and helps users understand relationships between elements. Optics uses a base-8 spacing system with tokens ranging from xs (4px) to 2xl (48px).',
    tokens: designTokens.filter(t => t.category === 'spacing').map(t => t.name)
  },
  {
    section: 'typography',
    title: 'Typography',
    content: 'Typography is crucial for creating clear information hierarchy and readability. Optics provides font family, size, weight, and line height tokens to ensure consistent text styling.',
    tokens: designTokens.filter(t => t.category === 'typography').map(t => t.name)
  },
  {
    section: 'components',
    title: 'Components',
    content: 'Optics components are reusable UI elements built with design tokens. Each component follows accessibility best practices and includes comprehensive documentation on usage and token application.',
    tokens: []
  },
  {
    section: 'accessibility',
    title: 'Accessibility Guidelines',
    content: 'Accessibility is a core principle of Optics. All components meet WCAG 2.1 AA standards. Ensure proper color contrast, keyboard navigation, and screen reader support when using Optics components.',
    tokens: []
  }
];

/**
 * Get token usage statistics
 */
export function getTokenUsageStats() {
  const categoryCount: Record<string, number> = {};
  
  designTokens.forEach(token => {
    categoryCount[token.category] = (categoryCount[token.category] || 0) + 1;
  });
  
  return {
    totalTokens: designTokens.length,
    categories: categoryCount,
    tokens: designTokens
  };
}

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
  
  const tokenDetails = component.tokens.map(tokenName => 
    designTokens.find(t => t.name === tokenName)
  ).filter((token): token is DesignToken => token !== undefined);
  
  return {
    component: component.name,
    description: component.description,
    tokenCount: component.tokens.length,
    tokens: tokenDetails
  };
}
