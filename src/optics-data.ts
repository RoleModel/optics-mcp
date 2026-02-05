/**
 * Optics Design System Data
 * AUTO-GENERATED - Run: npm run sync-data
 * Version: 2.3.0 | Generated: 2026-02-05T21:51:53.056Z
 */

export type TokenCategory = 'animation' | 'border' | 'breakpoint' | 'color' | 'encoded-image' | 'input' | 'opacity' | 'shadow' | 'sizing' | 'spacing' | 'typography' | 'z-index';

export interface DesignToken {
  name: string;
  cssVar: string;
  value: string;
  category: TokenCategory;
  description: string;
}

export interface CSSPattern {
  name: string;
  description: string;
  className: string;
  type: 'component' | 'layout' | 'utility';
  modifiers: string[];
  elements: string[];
  exampleHtml: string;
  docsUrl: string;
}

export interface Component extends CSSPattern {
  tokens: string[];
  usage: string;
  examples: string[];
}

export interface Documentation {
  section: string;
  title: string;
  content: string;
  tokens: string[];
}

export const designTokens: DesignToken[] = [
  {
    "name": "color-white",
    "cssVar": "--op-color-white",
    "value": "hsl(0deg 100% 100%)",
    "category": "color",
    "description": "color token: color-white"
  },
  {
    "name": "color-black",
    "cssVar": "--op-color-black",
    "value": "hsl(0deg 0% 0%)",
    "category": "color",
    "description": "color token: color-black"
  },
  {
    "name": "color-primary-h",
    "cssVar": "--op-color-primary-h",
    "value": "216",
    "category": "color",
    "description": "Hue component (HSL) for color-primary"
  },
  {
    "name": "color-primary-s",
    "cssVar": "--op-color-primary-s",
    "value": "58%",
    "category": "color",
    "description": "Saturation component (HSL) for color-primary"
  },
  {
    "name": "color-primary-l",
    "cssVar": "--op-color-primary-l",
    "value": "48%",
    "category": "color",
    "description": "Lightness component (HSL) for color-primary"
  },
  {
    "name": "color-primary-original",
    "cssVar": "--op-color-primary-original",
    "value": "hsl(var(--op-color-primary-h) var(--op-color-primary-s) var(--op-color-primary-l))",
    "category": "color",
    "description": "color token: color-primary-original"
  },
  {
    "name": "color-neutral-h",
    "cssVar": "--op-color-neutral-h",
    "value": "var(--op-color-primary-h)",
    "category": "color",
    "description": "Hue component (HSL) for color-neutral"
  },
  {
    "name": "color-neutral-s",
    "cssVar": "--op-color-neutral-s",
    "value": "4%",
    "category": "color",
    "description": "Saturation component (HSL) for color-neutral"
  },
  {
    "name": "color-neutral-l",
    "cssVar": "--op-color-neutral-l",
    "value": "var(--op-color-primary-l)",
    "category": "color",
    "description": "Lightness component (HSL) for color-neutral"
  },
  {
    "name": "color-neutral-original",
    "cssVar": "--op-color-neutral-original",
    "value": "hsl(var(--op-color-neutral-h) var(--op-color-neutral-s) var(--op-color-neutral-l))",
    "category": "color",
    "description": "color token: color-neutral-original"
  },
  {
    "name": "color-alerts-warning-h",
    "cssVar": "--op-color-alerts-warning-h",
    "value": "47",
    "category": "color",
    "description": "Hue component (HSL) for color-alerts-warning"
  },
  {
    "name": "color-alerts-warning-s",
    "cssVar": "--op-color-alerts-warning-s",
    "value": "100%",
    "category": "color",
    "description": "Saturation component (HSL) for color-alerts-warning"
  },
  {
    "name": "color-alerts-warning-l",
    "cssVar": "--op-color-alerts-warning-l",
    "value": "61%",
    "category": "color",
    "description": "Lightness component (HSL) for color-alerts-warning"
  },
  {
    "name": "color-alerts-warning-original",
    "cssVar": "--op-color-alerts-warning-original",
    "value": "hsl(var(--op-color-alerts-warning-h) var(--op-color-alerts-warning-s) var(--op-color-alerts-warning-l))",
    "category": "color",
    "description": "color token: color-alerts-warning-original"
  },
  {
    "name": "color-alerts-danger-h",
    "cssVar": "--op-color-alerts-danger-h",
    "value": "0",
    "category": "color",
    "description": "Hue component (HSL) for color-alerts-danger"
  },
  {
    "name": "color-alerts-danger-s",
    "cssVar": "--op-color-alerts-danger-s",
    "value": "99%",
    "category": "color",
    "description": "Saturation component (HSL) for color-alerts-danger"
  },
  {
    "name": "color-alerts-danger-l",
    "cssVar": "--op-color-alerts-danger-l",
    "value": "76%",
    "category": "color",
    "description": "Lightness component (HSL) for color-alerts-danger"
  },
  {
    "name": "color-alerts-danger-original",
    "cssVar": "--op-color-alerts-danger-original",
    "value": "hsl(var(--op-color-alerts-danger-h) var(--op-color-alerts-danger-s) var(--op-color-alerts-danger-l))",
    "category": "color",
    "description": "color token: color-alerts-danger-original"
  },
  {
    "name": "color-alerts-info-h",
    "cssVar": "--op-color-alerts-info-h",
    "value": "216",
    "category": "color",
    "description": "Hue component (HSL) for color-alerts-info"
  },
  {
    "name": "color-alerts-info-s",
    "cssVar": "--op-color-alerts-info-s",
    "value": "58%",
    "category": "color",
    "description": "Saturation component (HSL) for color-alerts-info"
  },
  {
    "name": "color-alerts-info-l",
    "cssVar": "--op-color-alerts-info-l",
    "value": "48%",
    "category": "color",
    "description": "Lightness component (HSL) for color-alerts-info"
  },
  {
    "name": "color-alerts-info-original",
    "cssVar": "--op-color-alerts-info-original",
    "value": "hsl(var(--op-color-alerts-info-h) var(--op-color-alerts-info-s) var(--op-color-alerts-info-l))",
    "category": "color",
    "description": "color token: color-alerts-info-original"
  },
  {
    "name": "color-alerts-notice-h",
    "cssVar": "--op-color-alerts-notice-h",
    "value": "130",
    "category": "color",
    "description": "Hue component (HSL) for color-alerts-notice"
  },
  {
    "name": "color-alerts-notice-s",
    "cssVar": "--op-color-alerts-notice-s",
    "value": "61%",
    "category": "color",
    "description": "Saturation component (HSL) for color-alerts-notice"
  },
  {
    "name": "color-alerts-notice-l",
    "cssVar": "--op-color-alerts-notice-l",
    "value": "64%",
    "category": "color",
    "description": "Lightness component (HSL) for color-alerts-notice"
  },
  {
    "name": "color-alerts-notice-original",
    "cssVar": "--op-color-alerts-notice-original",
    "value": "hsl(var(--op-color-alerts-notice-h) var(--op-color-alerts-notice-s) var(--op-color-alerts-notice-l))",
    "category": "color",
    "description": "color token: color-alerts-notice-original"
  },
  {
    "name": "color-border",
    "cssVar": "--op-color-border",
    "value": "var(--op-color-neutral-plus-five)",
    "category": "color",
    "description": "color token: color-border"
  },
  {
    "name": "color-background",
    "cssVar": "--op-color-background",
    "value": "var(--op-color-neutral-plus-eight)",
    "category": "color",
    "description": "color token: color-background"
  },
  {
    "name": "color-on-background",
    "cssVar": "--op-color-on-background",
    "value": "var(--op-color-neutral-on-plus-eight)",
    "category": "color",
    "description": "Text color for use ON background background. MUST be paired with matching background color."
  },
  {
    "name": "opacity-none",
    "cssVar": "--op-opacity-none",
    "value": "0",
    "category": "opacity",
    "description": "opacity token: opacity-none"
  },
  {
    "name": "opacity-overlay",
    "cssVar": "--op-opacity-overlay",
    "value": "0.2",
    "category": "opacity",
    "description": "opacity token: opacity-overlay"
  },
  {
    "name": "opacity-disabled",
    "cssVar": "--op-opacity-disabled",
    "value": "0.4",
    "category": "opacity",
    "description": "opacity token: opacity-disabled"
  },
  {
    "name": "opacity-half",
    "cssVar": "--op-opacity-half",
    "value": "0.5",
    "category": "opacity",
    "description": "opacity token: opacity-half"
  },
  {
    "name": "opacity-full",
    "cssVar": "--op-opacity-full",
    "value": "1",
    "category": "opacity",
    "description": "opacity token: opacity-full"
  },
  {
    "name": "breakpoint-x-small",
    "cssVar": "--op-breakpoint-x-small",
    "value": "512px",
    "category": "breakpoint",
    "description": "breakpoint token: breakpoint-x-small"
  },
  {
    "name": "breakpoint-small",
    "cssVar": "--op-breakpoint-small",
    "value": "768px",
    "category": "breakpoint",
    "description": "breakpoint token: breakpoint-small"
  },
  {
    "name": "breakpoint-medium",
    "cssVar": "--op-breakpoint-medium",
    "value": "1024px",
    "category": "breakpoint",
    "description": "breakpoint token: breakpoint-medium"
  },
  {
    "name": "breakpoint-large",
    "cssVar": "--op-breakpoint-large",
    "value": "1280px",
    "category": "breakpoint",
    "description": "breakpoint token: breakpoint-large"
  },
  {
    "name": "breakpoint-x-large",
    "cssVar": "--op-breakpoint-x-large",
    "value": "1440px",
    "category": "breakpoint",
    "description": "breakpoint token: breakpoint-x-large"
  },
  {
    "name": "radius-small",
    "cssVar": "--op-radius-small",
    "value": "2px",
    "category": "border",
    "description": "border token: radius-small"
  },
  {
    "name": "radius-medium",
    "cssVar": "--op-radius-medium",
    "value": "4px",
    "category": "border",
    "description": "border token: radius-medium"
  },
  {
    "name": "radius-large",
    "cssVar": "--op-radius-large",
    "value": "8px",
    "category": "border",
    "description": "border token: radius-large"
  },
  {
    "name": "radius-x-large",
    "cssVar": "--op-radius-x-large",
    "value": "12px",
    "category": "border",
    "description": "border token: radius-x-large"
  },
  {
    "name": "radius-2x-large",
    "cssVar": "--op-radius-2x-large",
    "value": "16px",
    "category": "border",
    "description": "border token: radius-2x-large"
  },
  {
    "name": "radius-circle",
    "cssVar": "--op-radius-circle",
    "value": "50%",
    "category": "border",
    "description": "border token: radius-circle"
  },
  {
    "name": "radius-pill",
    "cssVar": "--op-radius-pill",
    "value": "9999px",
    "category": "border",
    "description": "border token: radius-pill"
  },
  {
    "name": "border-width",
    "cssVar": "--op-border-width",
    "value": "1px",
    "category": "border",
    "description": "border token: border-width"
  },
  {
    "name": "border-width-large",
    "cssVar": "--op-border-width-large",
    "value": "2px",
    "category": "border",
    "description": "border token: border-width-large"
  },
  {
    "name": "border-width-x-large",
    "cssVar": "--op-border-width-x-large",
    "value": "4px",
    "category": "border",
    "description": "border token: border-width-x-large"
  },
  {
    "name": "border-none",
    "cssVar": "--op-border-none",
    "value": "0 0 0 0",
    "category": "border",
    "description": "border token: border-none"
  },
  {
    "name": "border-all",
    "cssVar": "--op-border-all",
    "value": "0 0 0 var(--op-border-width)",
    "category": "border",
    "description": "border token: border-all"
  },
  {
    "name": "border-top",
    "cssVar": "--op-border-top",
    "value": "0 calc(-1 * var(--op-border-width)) 0 0",
    "category": "border",
    "description": "border token: border-top"
  },
  {
    "name": "border-right",
    "cssVar": "--op-border-right",
    "value": "var(--op-border-width) 0 0 0",
    "category": "border",
    "description": "border token: border-right"
  },
  {
    "name": "border-bottom",
    "cssVar": "--op-border-bottom",
    "value": "0 var(--op-border-width) 0 0",
    "category": "border",
    "description": "border token: border-bottom"
  },
  {
    "name": "border-left",
    "cssVar": "--op-border-left",
    "value": "calc(-1 * var(--op-border-width)) 0 0 0",
    "category": "border",
    "description": "border token: border-left"
  },
  {
    "name": "border-y",
    "cssVar": "--op-border-y",
    "value": "var(--op-border-top) var(--op-color-border), var(--op-border-bottom) var(--op-color-border)",
    "category": "border",
    "description": "border token: border-y"
  },
  {
    "name": "border-x",
    "cssVar": "--op-border-x",
    "value": "var(--op-border-left) var(--op-color-border), var(--op-border-right) var(--op-color-border)",
    "category": "border",
    "description": "border token: border-x"
  },
  {
    "name": "font-scale-unit",
    "cssVar": "--op-font-scale-unit",
    "value": "1rem",
    "category": "typography",
    "description": "typography token: font-scale-unit"
  },
  {
    "name": "font-2x-small",
    "cssVar": "--op-font-2x-small",
    "value": "calc(var(--op-font-scale-unit) * 1)",
    "category": "typography",
    "description": "typography token: font-2x-small"
  },
  {
    "name": "font-x-small",
    "cssVar": "--op-font-x-small",
    "value": "calc(var(--op-font-scale-unit) * 1.2)",
    "category": "typography",
    "description": "typography token: font-x-small"
  },
  {
    "name": "font-small",
    "cssVar": "--op-font-small",
    "value": "calc(var(--op-font-scale-unit) * 1.4)",
    "category": "typography",
    "description": "typography token: font-small"
  },
  {
    "name": "font-medium",
    "cssVar": "--op-font-medium",
    "value": "calc(var(--op-font-scale-unit) * 1.6)",
    "category": "typography",
    "description": "typography token: font-medium"
  },
  {
    "name": "font-large",
    "cssVar": "--op-font-large",
    "value": "calc(var(--op-font-scale-unit) * 1.8)",
    "category": "typography",
    "description": "typography token: font-large"
  },
  {
    "name": "font-x-large",
    "cssVar": "--op-font-x-large",
    "value": "calc(var(--op-font-scale-unit) * 2)",
    "category": "typography",
    "description": "typography token: font-x-large"
  },
  {
    "name": "font-2x-large",
    "cssVar": "--op-font-2x-large",
    "value": "calc(var(--op-font-scale-unit) * 2.4)",
    "category": "typography",
    "description": "typography token: font-2x-large"
  },
  {
    "name": "font-3x-large",
    "cssVar": "--op-font-3x-large",
    "value": "calc(var(--op-font-scale-unit) * 2.8)",
    "category": "typography",
    "description": "typography token: font-3x-large"
  },
  {
    "name": "font-4x-large",
    "cssVar": "--op-font-4x-large",
    "value": "calc(var(--op-font-scale-unit) * 3.2)",
    "category": "typography",
    "description": "typography token: font-4x-large"
  },
  {
    "name": "font-5x-large",
    "cssVar": "--op-font-5x-large",
    "value": "calc(var(--op-font-scale-unit) * 3.6)",
    "category": "typography",
    "description": "typography token: font-5x-large"
  },
  {
    "name": "font-6x-large",
    "cssVar": "--op-font-6x-large",
    "value": "calc(var(--op-font-scale-unit) * 4.8)",
    "category": "typography",
    "description": "typography token: font-6x-large"
  },
  {
    "name": "font-weight-thin",
    "cssVar": "--op-font-weight-thin",
    "value": "100",
    "category": "typography",
    "description": "typography token: font-weight-thin"
  },
  {
    "name": "font-weight-extra-light",
    "cssVar": "--op-font-weight-extra-light",
    "value": "200",
    "category": "typography",
    "description": "typography token: font-weight-extra-light"
  },
  {
    "name": "font-weight-light",
    "cssVar": "--op-font-weight-light",
    "value": "300",
    "category": "typography",
    "description": "typography token: font-weight-light"
  },
  {
    "name": "font-weight-normal",
    "cssVar": "--op-font-weight-normal",
    "value": "400",
    "category": "typography",
    "description": "typography token: font-weight-normal"
  },
  {
    "name": "font-weight-medium",
    "cssVar": "--op-font-weight-medium",
    "value": "500",
    "category": "typography",
    "description": "typography token: font-weight-medium"
  },
  {
    "name": "font-weight-semi-bold",
    "cssVar": "--op-font-weight-semi-bold",
    "value": "600",
    "category": "typography",
    "description": "typography token: font-weight-semi-bold"
  },
  {
    "name": "font-weight-bold",
    "cssVar": "--op-font-weight-bold",
    "value": "700",
    "category": "typography",
    "description": "typography token: font-weight-bold"
  },
  {
    "name": "font-weight-extra-bold",
    "cssVar": "--op-font-weight-extra-bold",
    "value": "800",
    "category": "typography",
    "description": "typography token: font-weight-extra-bold"
  },
  {
    "name": "font-weight-black",
    "cssVar": "--op-font-weight-black",
    "value": "900",
    "category": "typography",
    "description": "typography token: font-weight-black"
  },
  {
    "name": "font-family",
    "cssVar": "--op-font-family",
    "value": "'Noto Sans', sans-serif",
    "category": "typography",
    "description": "typography token: font-family"
  },
  {
    "name": "line-height-none",
    "cssVar": "--op-line-height-none",
    "value": "0",
    "category": "sizing",
    "description": "sizing token: line-height-none"
  },
  {
    "name": "line-height-densest",
    "cssVar": "--op-line-height-densest",
    "value": "1",
    "category": "sizing",
    "description": "sizing token: line-height-densest"
  },
  {
    "name": "line-height-denser",
    "cssVar": "--op-line-height-denser",
    "value": "1.15",
    "category": "sizing",
    "description": "sizing token: line-height-denser"
  },
  {
    "name": "line-height-dense",
    "cssVar": "--op-line-height-dense",
    "value": "1.3",
    "category": "sizing",
    "description": "sizing token: line-height-dense"
  },
  {
    "name": "line-height-base",
    "cssVar": "--op-line-height-base",
    "value": "1.5",
    "category": "sizing",
    "description": "sizing token: line-height-base"
  },
  {
    "name": "line-height-loose",
    "cssVar": "--op-line-height-loose",
    "value": "1.6",
    "category": "sizing",
    "description": "sizing token: line-height-loose"
  },
  {
    "name": "line-height-looser",
    "cssVar": "--op-line-height-looser",
    "value": "1.7",
    "category": "sizing",
    "description": "sizing token: line-height-looser"
  },
  {
    "name": "line-height-loosest",
    "cssVar": "--op-line-height-loosest",
    "value": "1.8",
    "category": "sizing",
    "description": "sizing token: line-height-loosest"
  },
  {
    "name": "letter-spacing-navigation",
    "cssVar": "--op-letter-spacing-navigation",
    "value": "0.01rem",
    "category": "typography",
    "description": "typography token: letter-spacing-navigation"
  },
  {
    "name": "letter-spacing-label",
    "cssVar": "--op-letter-spacing-label",
    "value": "0.04rem",
    "category": "typography",
    "description": "typography token: letter-spacing-label"
  },
  {
    "name": "transition-accordion",
    "cssVar": "--op-transition-accordion",
    "value": "rotate 120ms ease-in",
    "category": "animation",
    "description": "animation token: transition-accordion"
  },
  {
    "name": "transition-input",
    "cssVar": "--op-transition-input",
    "value": "all 120ms ease-in",
    "category": "animation",
    "description": "animation token: transition-input"
  },
  {
    "name": "transition-sidebar",
    "cssVar": "--op-transition-sidebar",
    "value": "all 200ms ease-in-out",
    "category": "animation",
    "description": "animation token: transition-sidebar"
  },
  {
    "name": "transition-modal",
    "cssVar": "--op-transition-modal",
    "value": "all var(--op-transition-modal-time) ease-in",
    "category": "animation",
    "description": "animation token: transition-modal"
  },
  {
    "name": "transition-panel",
    "cssVar": "--op-transition-panel",
    "value": "right 400ms ease-in",
    "category": "animation",
    "description": "animation token: transition-panel"
  },
  {
    "name": "transition-tooltip",
    "cssVar": "--op-transition-tooltip",
    "value": "all 300ms ease-in 300ms",
    "category": "animation",
    "description": "animation token: transition-tooltip"
  },
  {
    "name": "animation-flash",
    "cssVar": "--op-animation-flash",
    "value": "rm-slide-in-out-flash 5s normal forwards",
    "category": "animation",
    "description": "animation token: animation-flash"
  },
  {
    "name": "encoded-images-dropdown-arrow",
    "cssVar": "--op-encoded-images-dropdown-arrow",
    "value": "url('data",
    "category": "encoded-image",
    "description": "encoded-image token: encoded-images-dropdown-arrow"
  },
  {
    "name": "size-unit",
    "cssVar": "--op-size-unit",
    "value": "0.4rem",
    "category": "sizing",
    "description": "sizing token: size-unit"
  },
  {
    "name": "space-scale-unit",
    "cssVar": "--op-space-scale-unit",
    "value": "1rem",
    "category": "spacing",
    "description": "spacing token: space-scale-unit"
  },
  {
    "name": "space-3x-small",
    "cssVar": "--op-space-3x-small",
    "value": "calc(var(--op-space-scale-unit) * 0.2)",
    "category": "spacing",
    "description": "spacing token: space-3x-small"
  },
  {
    "name": "space-2x-small",
    "cssVar": "--op-space-2x-small",
    "value": "calc(var(--op-space-scale-unit) * 0.4)",
    "category": "spacing",
    "description": "spacing token: space-2x-small"
  },
  {
    "name": "space-x-small",
    "cssVar": "--op-space-x-small",
    "value": "calc(var(--op-space-scale-unit) * 0.8)",
    "category": "spacing",
    "description": "spacing token: space-x-small"
  },
  {
    "name": "space-small",
    "cssVar": "--op-space-small",
    "value": "calc(var(--op-space-scale-unit) * 1.2)",
    "category": "spacing",
    "description": "spacing token: space-small"
  },
  {
    "name": "space-medium",
    "cssVar": "--op-space-medium",
    "value": "calc(var(--op-space-scale-unit) * 1.6)",
    "category": "spacing",
    "description": "spacing token: space-medium"
  },
  {
    "name": "space-large",
    "cssVar": "--op-space-large",
    "value": "calc(var(--op-space-scale-unit) * 2)",
    "category": "spacing",
    "description": "spacing token: space-large"
  },
  {
    "name": "space-x-large",
    "cssVar": "--op-space-x-large",
    "value": "calc(var(--op-space-scale-unit) * 2.4)",
    "category": "spacing",
    "description": "spacing token: space-x-large"
  },
  {
    "name": "space-2x-large",
    "cssVar": "--op-space-2x-large",
    "value": "calc(var(--op-space-scale-unit) * 2.8)",
    "category": "spacing",
    "description": "spacing token: space-2x-large"
  },
  {
    "name": "space-3x-large",
    "cssVar": "--op-space-3x-large",
    "value": "calc(var(--op-space-scale-unit) * 4)",
    "category": "spacing",
    "description": "spacing token: space-3x-large"
  },
  {
    "name": "space-4x-large",
    "cssVar": "--op-space-4x-large",
    "value": "calc(var(--op-space-scale-unit) * 8)",
    "category": "spacing",
    "description": "spacing token: space-4x-large"
  },
  {
    "name": "shadow-x-small",
    "cssVar": "--op-shadow-x-small",
    "value": "0 1px 3px hsl(0deg 0% 0% / 15%), 0 1px 2px hsl(0deg 0% 0% / 30%)",
    "category": "shadow",
    "description": "shadow token: shadow-x-small"
  },
  {
    "name": "shadow-small",
    "cssVar": "--op-shadow-small",
    "value": "0 2px 6px hsl(0deg 0% 0% / 15%), 0 1px 2px hsl(0deg 0% 0% / 30%)",
    "category": "shadow",
    "description": "shadow token: shadow-small"
  },
  {
    "name": "shadow-medium",
    "cssVar": "--op-shadow-medium",
    "value": "0 4px 8px hsl(0deg 0% 0% / 15%), 0 1px 3px hsl(0deg 0% 0% / 30%)",
    "category": "shadow",
    "description": "shadow token: shadow-medium"
  },
  {
    "name": "shadow-large",
    "cssVar": "--op-shadow-large",
    "value": "0 6px 10px hsl(0deg 0% 0% / 15%), 0 2px 3px hsl(0deg 0% 0% / 30%)",
    "category": "shadow",
    "description": "shadow token: shadow-large"
  },
  {
    "name": "shadow-x-large",
    "cssVar": "--op-shadow-x-large",
    "value": "0 8px 12px hsl(0deg 0% 0% / 15%), 0 4px 4px hsl(0deg 0% 0% / 30%)",
    "category": "shadow",
    "description": "shadow token: shadow-x-large"
  },
  {
    "name": "z-index-header",
    "cssVar": "--op-z-index-header",
    "value": "500",
    "category": "z-index",
    "description": "z-index token: z-index-header"
  },
  {
    "name": "z-index-footer",
    "cssVar": "--op-z-index-footer",
    "value": "500",
    "category": "z-index",
    "description": "z-index token: z-index-footer"
  },
  {
    "name": "z-index-sidebar",
    "cssVar": "--op-z-index-sidebar",
    "value": "700",
    "category": "z-index",
    "description": "z-index token: z-index-sidebar"
  },
  {
    "name": "z-index-dialog",
    "cssVar": "--op-z-index-dialog",
    "value": "800",
    "category": "z-index",
    "description": "z-index token: z-index-dialog"
  },
  {
    "name": "z-index-dialog-backdrop",
    "cssVar": "--op-z-index-dialog-backdrop",
    "value": "801",
    "category": "z-index",
    "description": "z-index token: z-index-dialog-backdrop"
  },
  {
    "name": "z-index-dialog-content",
    "cssVar": "--op-z-index-dialog-content",
    "value": "802",
    "category": "z-index",
    "description": "z-index token: z-index-dialog-content"
  },
  {
    "name": "z-index-dropdown",
    "cssVar": "--op-z-index-dropdown",
    "value": "900",
    "category": "z-index",
    "description": "z-index token: z-index-dropdown"
  },
  {
    "name": "z-index-alert-group",
    "cssVar": "--op-z-index-alert-group",
    "value": "950",
    "category": "z-index",
    "description": "z-index token: z-index-alert-group"
  },
  {
    "name": "z-index-tooltip",
    "cssVar": "--op-z-index-tooltip",
    "value": "1000",
    "category": "z-index",
    "description": "z-index token: z-index-tooltip"
  },
  {
    "name": "input-height-small",
    "cssVar": "--op-input-height-small",
    "value": "2.8rem",
    "category": "input",
    "description": "input token: input-height-small"
  },
  {
    "name": "input-height-medium",
    "cssVar": "--op-input-height-medium",
    "value": "3.6rem",
    "category": "input",
    "description": "input token: input-height-medium"
  },
  {
    "name": "input-height-large",
    "cssVar": "--op-input-height-large",
    "value": "4rem",
    "category": "input",
    "description": "input token: input-height-large"
  },
  {
    "name": "input-height-x-large",
    "cssVar": "--op-input-height-x-large",
    "value": "8.4rem",
    "category": "input",
    "description": "input token: input-height-x-large"
  },
  {
    "name": "input-inner-focus",
    "cssVar": "--op-input-inner-focus",
    "value": "inset 0 0 0 var(--op-border-width-large)",
    "category": "input",
    "description": "input token: input-inner-focus"
  },
  {
    "name": "input-outer-focus",
    "cssVar": "--op-input-outer-focus",
    "value": "0 0 0 var(--op-border-width-x-large)",
    "category": "input",
    "description": "input token: input-outer-focus"
  }
];

export const cssPatterns: CSSPattern[] = [
  {
    "name": "Accordion",
    "description": "Accordion classes are built on the `details` and `summary` html elements. They provide consistent and composable styling for disclosure widgets.",
    "className": "accordion",
    "type": "component",
    "modifiers": [
      "accordion--disable-animation"
    ],
    "elements": [
      "accordion__label",
      "accordion__marker"
    ],
    "exampleHtml": "<div class=\"accordion\">\n  <div class=\"accordion__label\">...</div>\n  <div class=\"accordion__marker\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-accordion--docs"
  },
  {
    "name": "Alert",
    "description": "Alert classes can be used to create a highlighted message or callout in your application.",
    "className": "alert",
    "type": "component",
    "modifiers": [
      "alert--alert",
      "alert--danger",
      "alert--filled",
      "alert--flash",
      "alert--info",
      "alert--muted",
      "alert--notice",
      "alert--warning"
    ],
    "elements": [
      "alert__description",
      "alert__icon",
      "alert__messages",
      "alert__title"
    ],
    "exampleHtml": "<div class=\"alert\">\n  <div class=\"alert__description\">...</div>\n  <div class=\"alert__icon\">...</div>\n  <div class=\"alert__messages\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-alert--docs"
  },
  {
    "name": "Avatar",
    "description": "Avatar classes can be used on `a` or `div` html elements with an `img` within it. They provide consistent and composable styling for application avatars or profile pictures.",
    "className": "avatar",
    "type": "component",
    "modifiers": [
      "avatar--disabled",
      "avatar--large",
      "avatar--medium",
      "avatar--small"
    ],
    "elements": [],
    "exampleHtml": "<div class=\"avatar\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-avatar--docs"
  },
  {
    "name": "Badge",
    "description": "The Badge component is similar to the Tag component, however it has a different semantic purpose. Badge is intended to be used for notification and information where Tag is intended to be used for interaction and input. See [Tag](?path=/docs/components-tag--docs) for details on its usage.",
    "className": "badge",
    "type": "component",
    "modifiers": [
      "badge--danger",
      "badge--info",
      "badge--notice",
      "badge--notification-left",
      "badge--notification-right",
      "badge--pill",
      "badge--primary",
      "badge--warning",
      "btn--with-badge"
    ],
    "elements": [],
    "exampleHtml": "<div class=\"badge\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-badge--docs"
  },
  {
    "name": "Breadcrumbs",
    "description": "The breadcrumbs component is used to show the user's current location in a hierarchy of pages.",
    "className": "breadcrumbs",
    "type": "component",
    "modifiers": [
      "breadcrumbs--large",
      "breadcrumbs--small"
    ],
    "elements": [
      "breadcrumbs__link",
      "breadcrumbs__separator",
      "breadcrumbs__text"
    ],
    "exampleHtml": "<div class=\"breadcrumbs\">\n  <div class=\"breadcrumbs__link\">...</div>\n  <div class=\"breadcrumbs__text\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-breadcrumbs--docs"
  },
  {
    "name": "Button",
    "description": "Button classes can be used on `button` or `a` html elements. They provide consistent and composable styling that should address most applications basic needs.",
    "className": "btn",
    "type": "component",
    "modifiers": [
      "btn--active",
      "btn--delete",
      "btn--destructive",
      "btn--disabled",
      "btn--icon",
      "btn--icon-with-label",
      "btn--large",
      "btn--medium",
      "btn--no-border",
      "btn--pill",
      "btn--primary",
      "btn--small",
      "btn--warning",
      "btn--with-badge"
    ],
    "elements": [],
    "exampleHtml": "<button class=\"btn btn--primary\">Button</button>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-button--docs"
  },
  {
    "name": "ButtonGroup",
    "description": "ButtonGroup component",
    "className": "btn-group",
    "type": "component",
    "modifiers": [],
    "elements": [
      "btn-group-toolbar"
    ],
    "exampleHtml": "<div class=\"btn-group\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-buttongroup--docs"
  },
  {
    "name": "Card",
    "description": "Card classes can be used to denote bordered sections of an application. They provide simple styles to create sections or \"cards\" for your interface. They can also be used as a starting point for \"row\" or list styles.",
    "className": "card",
    "type": "component",
    "modifiers": [
      "card--condensed",
      "card--padded",
      "card--shadow-large",
      "card--shadow-medium",
      "card--shadow-small",
      "card--shadow-x-large",
      "card--shadow-x-small"
    ],
    "elements": [
      "card__body",
      "card__footer",
      "card__header"
    ],
    "exampleHtml": "<div class=\"card\">\n  <div class=\"card__header\">...</div>\n  <div class=\"card__body\">...</div>\n  <div class=\"card__footer\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-card--docs"
  },
  {
    "name": "ConfirmDialog",
    "description": "ConfirmDialog component",
    "className": "confirm-dialog-wrapper",
    "type": "component",
    "modifiers": [
      "confirm-dialog-wrapper--active"
    ],
    "elements": [
      "confirm-dialog",
      "confirm-dialog-wrapper__backdrop",
      "confirm-dialog__body",
      "confirm-dialog__footer",
      "confirm-dialog__header"
    ],
    "exampleHtml": "<div class=\"confirm-dialog-wrapper\">\n  <div class=\"confirm-dialog-wrapper__backdrop\">...</div>\n  <div class=\"confirm-dialog__header\">...</div>\n  <div class=\"confirm-dialog__body\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-confirmdialog--docs"
  },
  {
    "name": "ContentHeader",
    "description": "ContentHeader component",
    "className": "content-header",
    "type": "component",
    "modifiers": [],
    "elements": [
      "content-header__aside",
      "content-header__context",
      "content-header__details",
      "content-header__subline",
      "content-header__title",
      "context-header__aside",
      "context-header__context",
      "context-header__details",
      "context-header__subline"
    ],
    "exampleHtml": "<div class=\"content-header\">\n  <div class=\"content-header__details\">...</div>\n  <div class=\"content-header__context\">...</div>\n  <div class=\"content-header__title\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-contentheader--docs"
  },
  {
    "name": "Divider",
    "description": "Divider classes can be used to create horizontal or vertical visual divides between content.",
    "className": "divider",
    "type": "component",
    "modifiers": [
      "divider--large",
      "divider--medium",
      "divider--small",
      "divider--spacing-large",
      "divider--spacing-medium",
      "divider--spacing-small",
      "divider--vertical"
    ],
    "elements": [],
    "exampleHtml": "<div class=\"divider\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-divider--docs"
  },
  {
    "name": "Form",
    "description": "Form classes can be used on a variety of `inputs` or `select` HTML elements.",
    "className": "form-label",
    "type": "component",
    "modifiers": [
      "form-control--large",
      "form-control--medium",
      "form-control--no-border",
      "form-control--small",
      "form-group--error",
      "form-group--inline"
    ],
    "elements": [
      "form-control",
      "form-error",
      "form-error-summary",
      "form-group",
      "form-hint"
    ],
    "exampleHtml": "<div class=\"form-label\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-form--docs"
  },
  {
    "name": "Icon",
    "description": "Icon classes are built on top of [Google's Material Symbols Icon Font](https://fonts.google.com/icons). They provide a way to integrate iconography into your application in a flexible and customizable way.",
    "className": "ph",
    "type": "component",
    "modifiers": [
      "icon--filled",
      "icon--high-emphasis",
      "icon--large",
      "icon--low-emphasis",
      "icon--medium",
      "icon--normal-emphasis",
      "icon--outlined",
      "icon--small",
      "icon--weight-bold",
      "icon--weight-light",
      "icon--weight-normal",
      "icon--weight-semi-bold",
      "icon--weight-thin",
      "icon--x-large"
    ],
    "elements": [
      "fi",
      "icon",
      "li",
      "ph-duotone",
      "ti"
    ],
    "exampleHtml": "<div class=\"ph\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-icon--docs"
  },
  {
    "name": "Modal",
    "description": "The Modal classes can be used for styling a custom modal. This can be used alongside the Rails configuration and Javascript implemented by [RoleModel Rails Modal](https://github.com/RoleModel/rolemodel_rails/tree/master/lib/generators/rolemodel/modals)",
    "className": "modal-wrapper",
    "type": "component",
    "modifiers": [
      "modal-wrapper--active"
    ],
    "elements": [
      "modal",
      "modal-wrapper__backdrop",
      "modal__body",
      "modal__footer",
      "modal__header"
    ],
    "exampleHtml": "<div class=\"modal-wrapper\">\n  <div class=\"modal-wrapper__backdrop\">...</div>\n  <div class=\"modal__header\">...</div>\n  <div class=\"modal__body\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-modal--docs"
  },
  {
    "name": "Navbar",
    "description": "Navbar classes provide simple styling for a navigation header.",
    "className": "navbar",
    "type": "component",
    "modifiers": [
      "navbar--primary",
      "navbar__content--justify-center",
      "navbar__content--justify-end",
      "navbar__content--justify-start"
    ],
    "elements": [
      "navbar__brand",
      "navbar__content",
      "navbar__content--justify-center",
      "navbar__content--justify-end",
      "navbar__content--justify-start"
    ],
    "exampleHtml": "<div class=\"navbar\">\n  <div class=\"navbar__brand\">...</div>\n  <div class=\"navbar__content\">...</div>\n  <div class=\"navbar__content--justify-start\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-navbar--docs"
  },
  {
    "name": "Pagination",
    "description": "Pagination is used to navigate through a series of pages, typically when dealing with tabular data.",
    "className": "pagination",
    "type": "component",
    "modifiers": [],
    "elements": [
      "pagination__divider"
    ],
    "exampleHtml": "<div class=\"pagination\">\n  <div class=\"pagination__divider\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-pagination--docs"
  },
  {
    "name": "SegmentedControl",
    "description": "Styles are built on css variables scoped to the segmented control.",
    "className": "segmented-control",
    "type": "component",
    "modifiers": [
      "segmented-control--full-width",
      "segmented-control--large",
      "segmented-control--medium",
      "segmented-control--small"
    ],
    "elements": [
      "segmented-control__input",
      "segmented-control__label"
    ],
    "exampleHtml": "<div class=\"segmented-control\">\n  <div class=\"segmented-control__input\">...</div>\n  <div class=\"segmented-control__label\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-segmentedcontrol--docs"
  },
  {
    "name": "SidePanel",
    "description": "Side Panel classes provide simple styling for a panel of sections with a scrollable body.",
    "className": "side-panel",
    "type": "component",
    "modifiers": [
      "side-panel--border-left",
      "side-panel--border-right",
      "side-panel__footer--padded",
      "side-panel__footer--padded-x",
      "side-panel__footer--padded-y",
      "side-panel__section--padded",
      "side-panel__section--padded-x",
      "side-panel__section--padded-y"
    ],
    "elements": [
      "side-panel__body",
      "side-panel__body--padded",
      "side-panel__body--padded-x",
      "side-panel__body--padded-y",
      "side-panel__footer",
      "side-panel__footer--padded",
      "side-panel__footer--padded-x",
      "side-panel__footer--padded-y",
      "side-panel__header",
      "side-panel__header--padded",
      "side-panel__header--padded-x",
      "side-panel__header--padded-y",
      "side-panel__section",
      "side-panel__section--padded",
      "side-panel__section--padded-x",
      "side-panel__section--padded-y"
    ],
    "exampleHtml": "<div class=\"side-panel\">\n  <div class=\"side-panel__header\">...</div>\n  <div class=\"side-panel__header--padded\">...</div>\n  <div class=\"side-panel__header--padded-x\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-sidepanel--docs"
  },
  {
    "name": "Sidebar",
    "description": "Sidebar classes provide simple styling for a navigation sidebar drawer, compact, or rail.",
    "className": "sidebar",
    "type": "component",
    "modifiers": [
      "sidebar--compact",
      "sidebar--drawer",
      "sidebar--padded",
      "sidebar--primary",
      "sidebar--rail",
      "sidebar__content--center",
      "sidebar__content--end",
      "sidebar__content--start"
    ],
    "elements": [
      "icon-with-label",
      "sidebar__brand",
      "sidebar__content",
      "sidebar__content--center",
      "sidebar__content--end",
      "sidebar__content--start"
    ],
    "exampleHtml": "<div class=\"sidebar\">\n  <div class=\"sidebar__brand\">...</div>\n  <div class=\"sidebar__content\">...</div>\n  <div class=\"sidebar__content--start\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-sidebar--docs"
  },
  {
    "name": "Spinner",
    "description": "Spinners are CSS loading indicators that should be shown when retrieving data or performing slow computations.",
    "className": "spinner",
    "type": "component",
    "modifiers": [
      "spinner--large",
      "spinner--medium",
      "spinner--small",
      "spinner--x-small"
    ],
    "elements": [],
    "exampleHtml": "<div class=\"spinner\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-spinner--docs"
  },
  {
    "name": "Switch",
    "description": "Switch classes can be used to create a stylized checkbox or boolean input.",
    "className": "switch",
    "type": "component",
    "modifiers": [
      "switch--large",
      "switch--small"
    ],
    "elements": [],
    "exampleHtml": "<div class=\"switch\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-switch--docs"
  },
  {
    "name": "Tab",
    "description": "Tab classes provide simple styling for a tab group navigation.",
    "className": "tab-group",
    "type": "component",
    "modifiers": [
      "tab--active",
      "tab--disabled",
      "tab--large",
      "tab--small"
    ],
    "elements": [
      "tab"
    ],
    "exampleHtml": "<div class=\"tab-group\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-tab--docs"
  },
  {
    "name": "Table",
    "description": "Table classes provide simple styling for tables and their content.",
    "className": "table",
    "type": "component",
    "modifiers": [
      "table--auto-layout",
      "table--comfortable-density",
      "table--compact-density",
      "table--container",
      "table--danger",
      "table--default-density",
      "table--even-striped",
      "table--fixed-layout",
      "table--odd-striped",
      "table--primary",
      "table--sticky-footer",
      "table--sticky-header"
    ],
    "elements": [
      "table-container"
    ],
    "exampleHtml": "<div class=\"table\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-table--docs"
  },
  {
    "name": "Tag",
    "description": "The tag component can be applied to an element with a button within it. The Tag component is similar to the Badge component, however it has a different semantic purpose. Tag is intended to be used for interaction and input where Badge is intended to be used for Notification and Information. See [Badge](?path=/docs/components-badge--docs) for details on its usage.",
    "className": "tag",
    "type": "component",
    "modifiers": [
      "tag--danger",
      "tag--info",
      "tag--notice",
      "tag--primary",
      "tag--read-only",
      "tag--warning"
    ],
    "elements": [
      "tag__label"
    ],
    "exampleHtml": "<div class=\"tag\">\n  <div class=\"tag__label\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-tag--docs"
  },
  {
    "name": "TextPair",
    "description": "TextPair component",
    "className": "text-pair",
    "type": "component",
    "modifiers": [
      "text-pair--inline",
      "text-pair__subtitle--large",
      "text-pair__subtitle--medium",
      "text-pair__subtitle--small",
      "text-pair__title--large",
      "text-pair__title--medium",
      "text-pair__title--small"
    ],
    "elements": [
      "text-pair__subtitle",
      "text-pair__subtitle--large",
      "text-pair__subtitle--medium",
      "text-pair__subtitle--small",
      "text-pair__title",
      "text-pair__title--large",
      "text-pair__title--medium",
      "text-pair__title--small"
    ],
    "exampleHtml": "<div class=\"text-pair\">\n  <div class=\"text-pair__title\">...</div>\n  <div class=\"text-pair__title--small\">...</div>\n  <div class=\"text-pair__title--medium\">...</div>\n</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-textpair--docs"
  },
  {
    "name": "Stack",
    "description": "Layout utility: op-stack",
    "className": "op-stack",
    "type": "layout",
    "modifiers": [],
    "elements": [],
    "exampleHtml": "<div class=\"op-stack\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/layout-stack--docs"
  },
  {
    "name": "Cluster",
    "description": "Layout utility: op-cluster",
    "className": "op-cluster",
    "type": "layout",
    "modifiers": [],
    "elements": [],
    "exampleHtml": "<div class=\"op-cluster\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/layout-cluster--docs"
  },
  {
    "name": "Split",
    "description": "Layout utility: op-split",
    "className": "op-split",
    "type": "layout",
    "modifiers": [],
    "elements": [],
    "exampleHtml": "<div class=\"op-split\">...</div>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/layout-split--docs"
  },
  {
    "name": "Tooltip",
    "description": "CSS-only tooltip using data attributes",
    "className": "[data-tooltip-text]",
    "type": "component",
    "modifiers": [
      "[data-tooltip-position=\"top\"]",
      "[data-tooltip-position=\"bottom\"]",
      "[data-tooltip-position=\"left\"]",
      "[data-tooltip-position=\"right\"]"
    ],
    "elements": [],
    "exampleHtml": "<button data-tooltip-text=\"Tooltip text\" data-tooltip-position=\"top\">Hover me</button>",
    "docsUrl": "https://docs.optics.rolemodel.design/?path=/docs/components-tooltip--docs"
  }
];

// Backwards compatibility: components alias with extended interface
export const components: Component[] = cssPatterns.map(p => ({
  ...p,
  tokens: p.modifiers,
  usage: p.description,
  examples: p.exampleHtml ? [p.exampleHtml] : [],
}));

export const documentation: Documentation[] = [
  {
    "section": "overview",
    "title": "Optics Overview",
    "content": "Optics is a CSS-only design system. It provides CSS custom properties (tokens) and utility classes - NOT JavaScript components. Use the provided CSS classes and tokens; do not write custom CSS for patterns that already exist.",
    "tokens": []
  },
  {
    "section": "color-pairing",
    "title": "Color Pairing Rule",
    "content": "CRITICAL: Background and text colors must ALWAYS be paired. Never use --op-color-{family}-{scale} without also setting color to --op-color-{family}-on-{scale}. The \"on\" tokens are calculated for proper contrast against their matching background.",
    "tokens": [
      "color-white",
      "color-black",
      "color-primary-h",
      "color-primary-s",
      "color-primary-l",
      "color-primary-original",
      "color-neutral-h",
      "color-neutral-s",
      "color-neutral-l",
      "color-neutral-original",
      "color-alerts-warning-h",
      "color-alerts-warning-s",
      "color-alerts-warning-l",
      "color-alerts-warning-original",
      "color-alerts-danger-h",
      "color-alerts-danger-s",
      "color-alerts-danger-l",
      "color-alerts-danger-original",
      "color-alerts-info-h",
      "color-alerts-info-s",
      "color-alerts-info-l",
      "color-alerts-info-original",
      "color-alerts-notice-h",
      "color-alerts-notice-s",
      "color-alerts-notice-l",
      "color-alerts-notice-original",
      "color-border",
      "color-background",
      "color-on-background"
    ]
  },
  {
    "section": "color-system",
    "title": "HSL Color System",
    "content": "Optics uses HSL-based colors defined by -h (hue), -s (saturation), -l (lightness) tokens. A full scale is generated from plus-max (lightest) to minus-max (darkest). Each scale step has a matching \"on-\" token for text.",
    "tokens": [
      "color-white",
      "color-black",
      "color-primary-h",
      "color-primary-s",
      "color-primary-l",
      "color-primary-original",
      "color-neutral-h",
      "color-neutral-s",
      "color-neutral-l",
      "color-neutral-original",
      "color-alerts-warning-h",
      "color-alerts-warning-s",
      "color-alerts-warning-l",
      "color-alerts-warning-original",
      "color-alerts-danger-h",
      "color-alerts-danger-s",
      "color-alerts-danger-l",
      "color-alerts-danger-original",
      "color-alerts-info-h",
      "color-alerts-info-s",
      "color-alerts-info-l",
      "color-alerts-info-original",
      "color-alerts-notice-h",
      "color-alerts-notice-s",
      "color-alerts-notice-l",
      "color-alerts-notice-original",
      "color-border",
      "color-background",
      "color-on-background"
    ]
  },
  {
    "section": "use-existing",
    "title": "Use Existing Classes",
    "content": "Don't write custom CSS for components that already exist. Use .btn for buttons, .card for cards, .op-stack/.op-cluster/.op-split for layouts. Only write custom CSS when truly extending the system.",
    "tokens": []
  }
];
