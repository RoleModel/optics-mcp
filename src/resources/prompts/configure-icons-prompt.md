# Configure Icons

Select and configure an icon library for your Optics project.

## Available Libraries

**Material Symbols** (default)
- Full variable font: fill, weight, emphasis, size
- Import: `@import '@rolemodel/optics/dist/css/core/fonts';`
- Usage: `<span class="icon material-symbols-outlined">settings</span>`

**Phosphor**
- Supports: fill, weight, size, duotone
- Import: `@import '@rolemodel/optics/dist/css/addons/fonts/phosphor_icons';`
- Usage: `<i class="icon ph ph-smiley"></i>`

**Tabler**
- Supports: size, filled (via `.ti-{name}-filled`)
- Import: `@import '@rolemodel/optics/dist/css/addons/fonts/tabler_icons';`
- Usage: `<i class="icon ti ti-settings"></i>`

**Feather**
- Supports: size only
- Import: `@import '@rolemodel/optics/dist/css/addons/fonts/feather_icons';`
- Usage: `<i class="icon fi fi-feather"></i>`

**Lucide**
- Supports: size only (larger library than Feather)
- Import: `@import '@rolemodel/optics/dist/css/addons/fonts/lucide_icons';`
- Usage: `<i class="icon li li-banana"></i>`

## Modifiers

- Size: `.icon--small`, `.icon--medium`, `.icon--large`, `.icon--x-large`
- Fill: `.icon--filled`, `.icon--outlined`
- Weight: `.icon--weight-light`, `.icon--weight-normal`, `.icon--weight-semi-bold`, `.icon--weight-bold`
- Emphasis: `.icon--low-emphasis`, `.icon--normal-emphasis`, `.icon--high-emphasis`

## Selection Guide

| Need | Recommended |
|------|-------------|
| Full customization | Material Symbols |
| Duotone icons | Phosphor |
| Clean minimal look | Tabler or Feather |
| Largest icon set | Lucide |
| Smallest bundle | Feather |
