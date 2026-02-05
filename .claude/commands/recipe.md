# Optics Recipe Command

Use this command to get real-world customization patterns from Optics.

## Usage

Find a recipe that matches your customization needs using the `use-recipe` prompt.

### Arguments

- `slug` - Get a specific recipe (e.g., "sidebar-domains", "layout-app-shell")
- `category` - Filter by category: layout, sidebar, header, component
- `query` - Search by keyword

### Examples

Get sidebar customization recipe:
```
/recipe slug:sidebar-domains
```

Browse all sidebar recipes:
```
/recipe category:sidebar
```

Search for dark theme examples:
```
/recipe query:dark
```

## Available Recipes

### Sidebar
- `sidebar-domains` - Domain registrar with wide drawer and custom footer
- `sidebar-16six` - Dark purple performance management sidebar

### Layout
- `layout-app-shell` - Standard app shell with sidebar, header, main area

### Header
- `aligned-header` - Three-section header with CSS Grid alignment

## What's Included

Each recipe provides:

1. **Description** - Use case and context
2. **Tokens Used** - Required Optics design tokens
3. **CSS** - Complete scoped stylesheet
4. **HTML** - Working markup example
5. **Docs Link** - Reference to full documentation
