/**
 * Detect Redundant CSS Tool
 * Finds CSS patterns that duplicate existing Optics components
 */

import { z } from 'zod';
import Tool, { type ToolInputSchema } from '../tool.js';
import { components, type Component } from '../../optics-data.js';
import { readToolFile } from '../../_internal/resource-path.js';

export interface RedundantPattern {
  cssPattern: string;
  line?: number;
  opticsComponent: string;
  opticsClass: string;
  confidence: 'high' | 'medium' | 'low';
  suggestion: string;
}

export interface DetectionResult {
  totalPatterns: number;
  redundantPatterns: RedundantPattern[];
  recommendations: string[];
}

/**
 * CSS patterns that map to Optics components
 */
const CSS_PATTERN_MAPPINGS: Array<{
  pattern: RegExp;
  component: string;
  className: string;
  confidence: 'high' | 'medium' | 'low';
  description: string;
}> = [
  // Button patterns
  {
    pattern: /display:\s*inline-flex.*align-items:\s*center.*justify-content:\s*center/s,
    component: 'Button',
    className: 'op-button',
    confidence: 'medium',
    description: 'Inline-flex centering pattern matches Button component'
  },
  {
    pattern: /padding:\s*[\d.]+(?:px|rem|em)\s+[\d.]+(?:px|rem|em).*border-radius.*cursor:\s*pointer/s,
    component: 'Button',
    className: 'op-button',
    confidence: 'medium',
    description: 'Button-like padding, border-radius, and cursor'
  },
  // Card patterns
  {
    pattern: /border-radius.*box-shadow.*padding.*background/s,
    component: 'Card',
    className: 'op-card',
    confidence: 'medium',
    description: 'Card-like container with shadow and padding'
  },
  {
    pattern: /\.card\s*\{/i,
    component: 'Card',
    className: 'op-card',
    confidence: 'high',
    description: 'Class named "card" - use Optics Card component'
  },
  // Alert/notification patterns
  {
    pattern: /\.alert\s*\{/i,
    component: 'Alert',
    className: 'op-alert',
    confidence: 'high',
    description: 'Class named "alert" - use Optics Alert component'
  },
  {
    pattern: /border-left:\s*[\d.]+(?:px|rem|em)\s+solid.*padding.*background/s,
    component: 'Alert',
    className: 'op-alert',
    confidence: 'medium',
    description: 'Alert-like left border accent pattern'
  },
  // Badge patterns
  {
    pattern: /\.badge\s*\{/i,
    component: 'Badge',
    className: 'op-badge',
    confidence: 'high',
    description: 'Class named "badge" - use Optics Badge component'
  },
  {
    pattern: /display:\s*inline.*padding:\s*[\d.]+(?:px|rem|em).*border-radius:\s*(?:9999px|50%|100px)/s,
    component: 'Badge',
    className: 'op-badge',
    confidence: 'medium',
    description: 'Pill-shaped inline element matches Badge'
  },
  // Modal patterns
  {
    pattern: /\.modal\s*\{/i,
    component: 'Modal',
    className: 'op-modal',
    confidence: 'high',
    description: 'Class named "modal" - use Optics Modal component'
  },
  {
    pattern: /position:\s*fixed.*inset:\s*0.*background.*rgba?\([^)]*0\.[0-9]/s,
    component: 'Modal',
    className: 'op-modal',
    confidence: 'medium',
    description: 'Fixed overlay pattern matches Modal backdrop'
  },
  // Form input patterns
  {
    pattern: /\.input\s*\{/i,
    component: 'Form',
    className: 'op-input',
    confidence: 'high',
    description: 'Class named "input" - use Optics Form input'
  },
  {
    pattern: /border:\s*1px\s+solid.*padding.*border-radius.*:focus/s,
    component: 'Form',
    className: 'op-input',
    confidence: 'medium',
    description: 'Input-like border and focus styles'
  },
  // Layout patterns - Stack
  {
    pattern: /display:\s*flex.*flex-direction:\s*column.*gap/s,
    component: 'Stack',
    className: 'op-stack',
    confidence: 'medium',
    description: 'Vertical flex with gap - use Stack layout'
  },
  // Layout patterns - Cluster
  {
    pattern: /display:\s*flex.*flex-wrap:\s*wrap.*gap/s,
    component: 'Cluster',
    className: 'op-cluster',
    confidence: 'medium',
    description: 'Wrapping flex with gap - use Cluster layout'
  },
  // Layout patterns - Split
  {
    pattern: /display:\s*flex.*justify-content:\s*space-between/s,
    component: 'Split',
    className: 'op-split',
    confidence: 'medium',
    description: 'Space-between flex - use Split layout'
  },
  // Spinner/loading patterns
  {
    pattern: /\.spinner\s*\{/i,
    component: 'Spinner',
    className: 'op-spinner',
    confidence: 'high',
    description: 'Class named "spinner" - use Optics Spinner'
  },
  {
    pattern: /@keyframes\s+spin|animation:.*rotate|animation:.*spin/i,
    component: 'Spinner',
    className: 'op-spinner',
    confidence: 'medium',
    description: 'Rotation animation - consider Optics Spinner'
  },
  // Table patterns
  {
    pattern: /\.table\s*\{/i,
    component: 'Table',
    className: 'op-table',
    confidence: 'high',
    description: 'Class named "table" - use Optics Table'
  },
  // Tab patterns
  {
    pattern: /\.tabs?\s*\{/i,
    component: 'Tab',
    className: 'op-tabs',
    confidence: 'high',
    description: 'Class named "tab(s)" - use Optics Tab component'
  },
  // Tooltip patterns
  {
    pattern: /\.tooltip\s*\{/i,
    component: 'Tooltip',
    className: 'op-tooltip',
    confidence: 'high',
    description: 'Class named "tooltip" - use Optics Tooltip'
  },
  {
    pattern: /position:\s*absolute.*::(?:before|after).*content:/s,
    component: 'Tooltip',
    className: 'op-tooltip',
    confidence: 'low',
    description: 'Pseudo-element positioning may be tooltip-like'
  },
];

class DetectRedundantCssTool extends Tool {
  name = 'detect_redundant_css';
  title = 'Detect Redundant CSS';
  description = 'Find CSS patterns that duplicate existing Optics components and suggest replacements';

  inputSchema = {
    css: z.string().describe('CSS code to analyze for redundant patterns'),
  };

  async handler(args: ToolInputSchema): Promise<string> {
    const { css } = args;
    const result = this.detectRedundantPatterns(css);
    const formatted = await this.formatResult(result);

    return formatted;
  }

  /**
   * Detect redundant CSS patterns
   */
  private detectRedundantPatterns(css: string): DetectionResult {
    const redundantPatterns: RedundantPattern[] = [];
    const lines = css.split('\n');

    for (const mapping of CSS_PATTERN_MAPPINGS) {
      const match = css.match(mapping.pattern);
      if (match) {
        // Find approximate line number
        let lineNumber: number | undefined;
        const matchIndex = match.index || 0;
        const beforeMatch = css.substring(0, matchIndex);
        lineNumber = beforeMatch.split('\n').length;

        // Check if component exists in Optics
        const opticsComponent = components.find(
          c => c.name.toLowerCase() === mapping.component.toLowerCase()
        );

        redundantPatterns.push({
          cssPattern: match[0].substring(0, 100) + (match[0].length > 100 ? '...' : ''),
          line: lineNumber,
          opticsComponent: mapping.component,
          opticsClass: opticsComponent?.className || mapping.className,
          confidence: mapping.confidence,
          suggestion: mapping.description
        });
      }
    }

    // Generate recommendations
    const recommendations = this.generateRecommendations(redundantPatterns);

    return {
      totalPatterns: CSS_PATTERN_MAPPINGS.length,
      redundantPatterns,
      recommendations
    };
  }

  /**
   * Generate recommendations based on findings
   */
  private generateRecommendations(patterns: RedundantPattern[]): string[] {
    const recommendations: string[] = [];

    if (patterns.length === 0) {
      recommendations.push('No obvious redundant patterns detected. Your CSS appears to be using custom styles appropriately.');
      recommendations.push('Consider using `list_components` to see all available Optics components.');
      return recommendations;
    }

    // Group by component
    const byComponent = new Map<string, RedundantPattern[]>();
    for (const pattern of patterns) {
      const existing = byComponent.get(pattern.opticsComponent) || [];
      existing.push(pattern);
      byComponent.set(pattern.opticsComponent, existing);
    }

    for (const [component, componentPatterns] of byComponent) {
      const highConfidence = componentPatterns.filter(p => p.confidence === 'high');
      const opticsComp = components.find(c => c.name.toLowerCase() === component.toLowerCase());

      if (highConfidence.length > 0) {
        recommendations.push(
          `**${component}**: Found ${highConfidence.length} pattern(s) that should use \`${opticsComp?.className || `op-${component.toLowerCase()}`}\` class.`
        );
      } else {
        recommendations.push(
          `**${component}**: Found ${componentPatterns.length} pattern(s) that may be replaceable with the Optics ${component} component.`
        );
      }

      if (opticsComp) {
        recommendations.push(`  - Use \`get_component_info\` with "${component}" for usage details.`);
      }
    }

    recommendations.push('');
    recommendations.push('Run `list_components` to see all available Optics components and their classes.');

    return recommendations;
  }

  /**
   * Format the detection result
   */
  private async formatResult(result: DetectionResult): Promise<string> {
    const template = await readToolFile('detect-redundant-css-result.md');

    let findingsText = '';
    if (result.redundantPatterns.length === 0) {
      findingsText = 'No redundant patterns detected.';
    } else {
      for (const pattern of result.redundantPatterns) {
        findingsText += `### ${pattern.opticsComponent} (${pattern.confidence} confidence)\n`;
        if (pattern.line) {
          findingsText += `- **Line**: ~${pattern.line}\n`;
        }
        findingsText += `- **Pattern**: \`${pattern.cssPattern.replace(/\n/g, ' ').trim()}\`\n`;
        findingsText += `- **Optics class**: \`${pattern.opticsClass}\`\n`;
        findingsText += `- **Suggestion**: ${pattern.suggestion}\n\n`;
      }
    }

    return template
      .replace('{{totalPatterns}}', result.totalPatterns.toString())
      .replace('{{redundantCount}}', result.redundantPatterns.length.toString())
      .replace('{{replacementCount}}', result.redundantPatterns.filter(p => p.confidence === 'high').length.toString())
      .replace('{{findings}}', findingsText)
      .replace('{{recommendations}}', result.recommendations.join('\n'));
  }
}

export default DetectRedundantCssTool;
