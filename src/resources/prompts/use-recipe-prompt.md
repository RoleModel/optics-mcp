# Optics Recipes

Optics provides real-world customization recipes showing how to extend and customize components for specific use cases.

## Available Categories

- **sidebar** - Custom sidebar configurations with brand colors, drawer modes, and navigation patterns
- **layout** - App shell layouts combining sidebar, header, and content areas
- **header** - Header patterns with aligned sections and navigation
- **component** - Custom component variations and patterns

## Available Recipes

### Sidebar

- **sidebar-domains** - Domain registrar sidebar with wide drawer, no border radius buttons, and custom footer
- **sidebar-16six** - Dark purple sidebar with custom brand colors for performance management software

### Layout

- **layout-app-shell** - Standard app layout with sidebar, header, and main content area using CSS Grid

### Header

- **aligned-header** - Header with aligned left/center/right sections using CSS Grid

## How to Use

Each recipe includes:

1. **Tokens Used** - Design tokens required for the customization
2. **CSS** - Scoped CSS that extends Optics base styles
3. **HTML** - Example markup structure

### Example Usage

To get a specific recipe with full CSS and HTML:

```
Use get_recipe with slug "sidebar-domains"
```

To search by category:

```
Use search_recipes with category "sidebar"
```

## Key Patterns

### Scoping Customizations

Recipes use modifier classes to scope customizations:

```css
.sidebar {
  &.sidebar--domains {
    /* Domain-specific customizations */
  }
}
```

### Token Overrides

Recipes show how to override private tokens (prefixed with `--_op-`):

```css
.sidebar--custom {
  --_op-sidebar-drawer-width: 28rem;
  --_op-sidebar-background-color: hsl(256deg 66% 15%);
}
```

### Composing with Optics Classes

Recipes combine with existing Optics utilities:

```html
<aside class="sidebar sidebar--custom sidebar--drawer">
  <div class="sidebar__content stack">
    <!-- Uses sidebar component + stack layout utility -->
  </div>
</aside>
```

## Docs Reference

Full recipe documentation: https://docs.optics.rolemodel.design/?path=/docs/recipes-custom-sidebar--docs
