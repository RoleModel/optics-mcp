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
 * Design Tokens - Core visual design elements
 */
export const designTokens: DesignToken[] = [
  // Color Tokens
  {
    name: 'color-primary',
    value: '#0066CC',
    category: 'color',
    description: 'Primary brand color used for main actions and emphasis'
  },
  {
    name: 'color-secondary',
    value: '#6C757D',
    category: 'color',
    description: 'Secondary color for supporting elements'
  },
  {
    name: 'color-success',
    value: '#28A745',
    category: 'color',
    description: 'Success state color for positive feedback'
  },
  {
    name: 'color-danger',
    value: '#DC3545',
    category: 'color',
    description: 'Danger/error state color for warnings and errors'
  },
  {
    name: 'color-warning',
    value: '#FFC107',
    category: 'color',
    description: 'Warning state color for cautionary information'
  },
  {
    name: 'color-info',
    value: '#17A2B8',
    category: 'color',
    description: 'Info state color for informational messages'
  },
  {
    name: 'color-background',
    value: '#FFFFFF',
    category: 'color',
    description: 'Default background color'
  },
  {
    name: 'color-surface',
    value: '#F8F9FA',
    category: 'color',
    description: 'Surface color for cards and panels'
  },
  {
    name: 'color-text-primary',
    value: '#212529',
    category: 'color',
    description: 'Primary text color'
  },
  {
    name: 'color-text-secondary',
    value: '#6C757D',
    category: 'color',
    description: 'Secondary text color for less emphasized content'
  },
  
  // Spacing Tokens
  {
    name: 'spacing-xs',
    value: '4px',
    category: 'spacing',
    description: 'Extra small spacing unit'
  },
  {
    name: 'spacing-sm',
    value: '8px',
    category: 'spacing',
    description: 'Small spacing unit'
  },
  {
    name: 'spacing-md',
    value: '16px',
    category: 'spacing',
    description: 'Medium spacing unit (base)'
  },
  {
    name: 'spacing-lg',
    value: '24px',
    category: 'spacing',
    description: 'Large spacing unit'
  },
  {
    name: 'spacing-xl',
    value: '32px',
    category: 'spacing',
    description: 'Extra large spacing unit'
  },
  {
    name: 'spacing-2xl',
    value: '48px',
    category: 'spacing',
    description: '2X large spacing unit'
  },
  
  // Typography Tokens
  {
    name: 'font-family-base',
    value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    category: 'typography',
    description: 'Base font family for body text'
  },
  {
    name: 'font-family-heading',
    value: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    category: 'typography',
    description: 'Font family for headings'
  },
  {
    name: 'font-family-mono',
    value: '"SF Mono", "Monaco", "Consolas", monospace',
    category: 'typography',
    description: 'Monospace font family for code'
  },
  {
    name: 'font-size-xs',
    value: '12px',
    category: 'typography',
    description: 'Extra small font size'
  },
  {
    name: 'font-size-sm',
    value: '14px',
    category: 'typography',
    description: 'Small font size'
  },
  {
    name: 'font-size-md',
    value: '16px',
    category: 'typography',
    description: 'Medium font size (base)'
  },
  {
    name: 'font-size-lg',
    value: '18px',
    category: 'typography',
    description: 'Large font size'
  },
  {
    name: 'font-size-xl',
    value: '20px',
    category: 'typography',
    description: 'Extra large font size'
  },
  {
    name: 'font-size-2xl',
    value: '24px',
    category: 'typography',
    description: '2X large font size'
  },
  {
    name: 'font-size-3xl',
    value: '32px',
    category: 'typography',
    description: '3X large font size'
  },
  {
    name: 'font-weight-normal',
    value: '400',
    category: 'typography',
    description: 'Normal font weight'
  },
  {
    name: 'font-weight-medium',
    value: '500',
    category: 'typography',
    description: 'Medium font weight'
  },
  {
    name: 'font-weight-semibold',
    value: '600',
    category: 'typography',
    description: 'Semibold font weight'
  },
  {
    name: 'font-weight-bold',
    value: '700',
    category: 'typography',
    description: 'Bold font weight'
  },
  {
    name: 'line-height-tight',
    value: '1.25',
    category: 'typography',
    description: 'Tight line height for headings'
  },
  {
    name: 'line-height-normal',
    value: '1.5',
    category: 'typography',
    description: 'Normal line height for body text'
  },
  {
    name: 'line-height-relaxed',
    value: '1.75',
    category: 'typography',
    description: 'Relaxed line height for long-form content'
  },
  
  // Border Radius Tokens
  {
    name: 'border-radius-sm',
    value: '4px',
    category: 'border',
    description: 'Small border radius'
  },
  {
    name: 'border-radius-md',
    value: '8px',
    category: 'border',
    description: 'Medium border radius'
  },
  {
    name: 'border-radius-lg',
    value: '12px',
    category: 'border',
    description: 'Large border radius'
  },
  {
    name: 'border-radius-full',
    value: '9999px',
    category: 'border',
    description: 'Full border radius for circular elements'
  },
  
  // Shadow Tokens
  {
    name: 'shadow-sm',
    value: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    category: 'shadow',
    description: 'Small shadow for subtle elevation'
  },
  {
    name: 'shadow-md',
    value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    category: 'shadow',
    description: 'Medium shadow for cards and panels'
  },
  {
    name: 'shadow-lg',
    value: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    category: 'shadow',
    description: 'Large shadow for modals and popovers'
  }
];

/**
 * Components - Reusable UI components with their design token usage
 */
export const components: Component[] = [
  {
    name: 'Button',
    description: 'Interactive button component for user actions',
    tokens: [
      'color-primary',
      'color-text-primary',
      'spacing-sm',
      'spacing-md',
      'font-size-md',
      'font-weight-medium',
      'border-radius-md',
      'shadow-sm'
    ],
    usage: 'Use buttons for primary user actions. Primary buttons use color-primary, secondary buttons use color-secondary.',
    examples: [
      '<button class="btn-primary">Primary Action</button>',
      '<button class="btn-secondary">Secondary Action</button>'
    ]
  },
  {
    name: 'Card',
    description: 'Container component for grouping related content',
    tokens: [
      'color-surface',
      'color-background',
      'spacing-md',
      'spacing-lg',
      'border-radius-lg',
      'shadow-md'
    ],
    usage: 'Use cards to group related information and create visual hierarchy. Cards should have consistent padding and elevation.',
    examples: [
      '<div class="card"><h3>Title</h3><p>Content</p></div>'
    ]
  },
  {
    name: 'Input',
    description: 'Text input field for user data entry',
    tokens: [
      'color-background',
      'color-text-primary',
      'color-primary',
      'spacing-sm',
      'spacing-md',
      'font-size-md',
      'border-radius-md'
    ],
    usage: 'Use inputs for collecting user data. Apply focus states using color-primary.',
    examples: [
      '<input type="text" placeholder="Enter text..." />',
      '<input type="email" placeholder="email@example.com" />'
    ]
  },
  {
    name: 'Alert',
    description: 'Notification component for important messages',
    tokens: [
      'color-success',
      'color-danger',
      'color-warning',
      'color-info',
      'spacing-md',
      'border-radius-md',
      'font-size-md'
    ],
    usage: 'Use alerts to communicate important information. Choose the appropriate color based on message type (success, danger, warning, info).',
    examples: [
      '<div class="alert alert-success">Success message</div>',
      '<div class="alert alert-danger">Error message</div>'
    ]
  },
  {
    name: 'Typography',
    description: 'Text styling and hierarchy system',
    tokens: [
      'font-family-base',
      'font-family-heading',
      'font-size-md',
      'font-size-lg',
      'font-size-xl',
      'font-size-2xl',
      'font-size-3xl',
      'font-weight-normal',
      'font-weight-semibold',
      'font-weight-bold',
      'line-height-normal',
      'line-height-tight',
      'color-text-primary',
      'color-text-secondary'
    ],
    usage: 'Use the typography system to create clear content hierarchy. Headings use font-family-heading with appropriate sizes and weights.',
    examples: [
      '<h1>Heading 1</h1>',
      '<p>Body text with normal line height</p>'
    ]
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
