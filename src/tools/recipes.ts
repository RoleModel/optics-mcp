/**
 * Recipes Tools for Optics Design System
 * Provides real-world customization examples and patterns
 */

export interface Recipe {
  name: string;
  slug: string;
  description: string;
  category: 'layout' | 'sidebar' | 'header' | 'component';
  docsUrl: string;
  tokens: string[];
  css: string;
  html: string;
}

/**
 * Available Optics recipes
 */
export const recipes: Recipe[] = [
  {
    name: 'Custom Sidebar',
    slug: 'sidebar-domains',
    description: 'A sidebar customization for domain registrar apps with wide drawer, no border radius buttons, and custom footer',
    category: 'sidebar',
    docsUrl: 'https://docs.optics.rolemodel.design/?path=/docs/recipes-custom-sidebar--docs',
    tokens: [
      '--_op-sidebar-drawer-width',
      '--_op-sidebar-content-spacing',
      '--_op-sidebar-content-item-spacing',
      '--op-color-primary-plus-five',
      '--op-color-primary-on-plus-five',
      '--op-color-neutral-plus-six',
      '--op-color-neutral-on-plus-six',
      '--op-radius-pill',
      '--op-space-small',
      '--op-space-large'
    ],
    css: `/* Domains Sidebar Example */
.sidebar {
  &.sidebar--domains {
    --_op-sidebar-drawer-width: 28rem;
    --_op-sidebar-content-spacing: 0;
    --_op-sidebar-content-item-spacing: 0;
    box-shadow: none;

    .btn {
      border-radius: 0;

      &.btn--no-border {
        box-shadow: none;

        &.btn--active {
          background-color: var(--op-color-primary-plus-five);
          color: var(--op-color-primary-on-plus-five);
        }

        &:hover:not(.btn--active) {
          background-color: var(--op-color-neutral-plus-six);
          box-shadow: none;
          color: var(--op-color-neutral-on-plus-six);
        }
      }

      &.btn--pill-right {
        border-radius: 0 var(--op-radius-pill) var(--op-radius-pill) 0;
      }
    }

    .sidebar__footer {
      display: flex;
      align-items: center;
      gap: var(--op-space-small);
      padding-inline-start: var(--op-space-large);
    }
  }
}`,
    html: `<aside class="sidebar sidebar--domains sidebar--drawer">
  <div class="sidebar__content">
    <button class="btn btn--no-border">
      <i class="icon ph ph-magnifying-glass"></i>
      <span>Get a new Domain</span>
    </button>
    <button class="btn btn--no-border btn--active">
      <i class="icon ph ph-list"></i>
      <span>My domains</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon ph ph-swap"></i>
      <span>Transfer</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon ph ph-credit-card"></i>
      <span>Billing</span>
    </button>
  </div>
  <div class="sidebar__footer">
    <i class="icon ph ph-flag"></i>
    <span>United States (US $)</span>
  </div>
</aside>`
  },
  {
    name: 'Custom Sidebar - 16Six Performance',
    slug: 'sidebar-16six',
    description: 'A dark purple sidebar with custom brand colors, rail and drawer modes, suitable for performance management software',
    category: 'sidebar',
    docsUrl: 'https://docs.optics.rolemodel.design/?path=/docs/recipes-custom-sidebar--docs',
    tokens: [
      '--_op-sidebar-background-color',
      '--_op-sidebar-text-color',
      '--_op-sidebar-border-color',
      '--_op-sidebar-rail-width',
      '--_op-sidebar-drawer-width',
      '--_op-sidebar-drawer-brand-width',
      '--_op-sidebar-brand-spacing',
      '--_op-sidebar-content-item-spacing',
      '--_op-sidebar-spacing',
      '--op-space-3x-large',
      '--op-space-medium',
      '--op-space-x-small',
      '--op-font-small'
    ],
    css: `/* 16Six Sidebar Example */
.icon--rotated-135 {
  rotate: 135deg;
}

.icon--rotated-90 {
  rotate: 90deg;
}

.sidebar {
  .sidebar__brand {
    justify-content: center;

    .sidebar__brand-label {
      display: none;
    }
  }

  &.sidebar--16six {
    --_op-sidebar-background-color: hsl(256deg 66% 15%);
    --_op-sidebar-text-color: hsl(26deg 100% 95%);
    --_op-sidebar-border-color: hsl(26deg 100% 95%);
    --_op-sidebar-rail-width: 6.4rem;
    --_op-sidebar-drawer-width: 22.4rem;
    --_op-sidebar-drawer-brand-width: calc(var(--op-space-3x-large) + (2 * var(--op-space-medium)));
    --_op-sidebar-brand-spacing: var(--op-space-medium) var(--op-space-x-small);
    --_op-sidebar-content-item-spacing: var(--op-space-x-small);
    --_op-sidebar-spacing: 0 0 var(--op-space-x-small);

    .sidebar__brand {
      display: flex;
      margin: 0;
      color: inherit;
      gap: var(--op-space-medium);
      text-decoration: none;

      svg {
        inline-size: var(--op-space-3x-large);
        block-size: var(--op-space-3x-large);
      }

      .sidebar__brand-label {
        display: flex;
        flex-direction: column;
        font-size: var(--op-font-small);
      }
    }

    .btn {
      &.btn--no-border {
        background-color: transparent;
        box-shadow: none;
        color: var(--_op-sidebar-text-color);

        &.btn--active,
        &:hover {
          background-color: hsl(256deg 23% 32%);
        }
      }
    }
  }
}`,
    html: `<aside class="sidebar sidebar--16six sidebar--drawer">
  <a href="#" class="sidebar__brand">
    <svg><!-- Logo SVG --></svg>
    <span class="sidebar__brand-label">
      <span>16Six</span>
      <span>RoleModel Software</span>
    </span>
  </a>
  <div class="sidebar__content">
    <button class="btn btn--no-border btn--active">
      <i class="icon material-symbols-outlined">home</i>
      <span>Home</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon material-symbols-outlined">edit_document</i>
      <span>Check-ins</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon material-symbols-outlined">chat</i>
      <span>1-on-1s</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon material-symbols-outlined">hand_gesture</i>
      <span>High Fives</span>
    </button>
    <button class="btn btn--no-border">
      <i class="icon material-symbols-outlined">track_changes</i>
      <span>Objectives</span>
    </button>
  </div>
  <button class="btn btn--no-border sidebar__collapse">
    <i class="icon material-symbols-outlined">expand_circle_down</i>
    <span>Collapse</span>
  </button>
</aside>`
  },
  {
    name: 'Layout - App Shell',
    slug: 'layout-app-shell',
    description: 'Standard app layout with sidebar, header, and main content area',
    category: 'layout',
    docsUrl: 'https://docs.optics.rolemodel.design/?path=/docs/recipes-layout--docs',
    tokens: [
      '--op-color-neutral-plus-eight',
      '--op-color-neutral-on-plus-eight',
      '--op-space-medium',
      '--op-space-large'
    ],
    css: `/* App Shell Layout */
.app-shell {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
}

.app-shell__sidebar {
  grid-row: 1 / -1;
}

.app-shell__header {
  grid-column: 2;
}

.app-shell__main {
  grid-column: 2;
  padding: var(--op-space-large);
  background-color: var(--op-color-neutral-plus-eight);
  color: var(--op-color-neutral-on-plus-eight);
}`,
    html: `<div class="app-shell">
  <aside class="app-shell__sidebar sidebar sidebar--rail">
    <!-- Sidebar content -->
  </aside>
  <header class="app-shell__header">
    <!-- Header content -->
  </header>
  <main class="app-shell__main container">
    <!-- Main content -->
  </main>
</div>`
  },
  {
    name: 'Aligned Header',
    slug: 'aligned-header',
    description: 'Header with aligned left/center/right sections',
    category: 'header',
    docsUrl: 'https://docs.optics.rolemodel.design/?path=/docs/recipes-aligned-header--docs',
    tokens: [
      '--op-space-medium',
      '--op-space-small'
    ],
    css: `/* Aligned Header */
.header-aligned {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--op-space-medium);
  padding: var(--op-space-small) var(--op-space-medium);
}

.header-aligned__start {
  justify-self: start;
}

.header-aligned__center {
  justify-self: center;
}

.header-aligned__end {
  justify-self: end;
}`,
    html: `<header class="header-aligned">
  <div class="header-aligned__start">
    <a href="#" class="sidebar__brand">Logo</a>
  </div>
  <nav class="header-aligned__center">
    <ul class="cluster">
      <li><a href="#">Link 1</a></li>
      <li><a href="#">Link 2</a></li>
      <li><a href="#">Link 3</a></li>
    </ul>
  </nav>
  <div class="header-aligned__end">
    <button class="btn btn--primary">Action</button>
  </div>
</header>`
  }
];

/**
 * Get recipe by slug
 */
export function getRecipe(slug: string): Recipe | undefined {
  return recipes.find(r => r.slug === slug);
}

/**
 * Search recipes by category or keyword
 */
export function searchRecipes(query?: string, category?: string): Recipe[] {
  let results = recipes;

  if (category) {
    results = results.filter(r => r.category === category);
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(r =>
      r.name.toLowerCase().includes(lowerQuery) ||
      r.description.toLowerCase().includes(lowerQuery) ||
      r.slug.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}

/**
 * List all recipe categories
 */
export function getRecipeCategories(): string[] {
  return Array.from(new Set(recipes.map(r => r.category)));
}

/**
 * Format recipe for display
 */
export function formatRecipe(recipe: Recipe): string {
  return `## ${recipe.name}

${recipe.description}

**Category:** ${recipe.category}
**Docs:** ${recipe.docsUrl}

### Tokens Used

${recipe.tokens.map(t => `- \`${t}\``).join('\n')}

### CSS

\`\`\`css
${recipe.css}
\`\`\`

### HTML

\`\`\`html
${recipe.html}
\`\`\`
`;
}

/**
 * Format recipe list for display
 */
export function formatRecipeList(recipeList: Recipe[]): string {
  if (recipeList.length === 0) {
    return 'No recipes found.\n\nAvailable categories: ' + getRecipeCategories().join(', ');
  }

  let output = `# Optics Recipes (${recipeList.length})\n\n`;

  const byCategory: Record<string, Recipe[]> = {};
  for (const recipe of recipeList) {
    if (!byCategory[recipe.category]) {
      byCategory[recipe.category] = [];
    }
    byCategory[recipe.category].push(recipe);
  }

  for (const [category, categoryRecipes] of Object.entries(byCategory)) {
    output += `## ${category.charAt(0).toUpperCase() + category.slice(1)}\n\n`;
    for (const recipe of categoryRecipes) {
      output += `- **${recipe.name}** (\`${recipe.slug}\`)\n  ${recipe.description}\n\n`;
    }
  }

  output += `\nUse \`get_recipe\` with a slug to get full details.`;
  return output;
}
