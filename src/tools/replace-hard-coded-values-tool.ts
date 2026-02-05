import { z } from 'zod'
import Tool from './tool.js'
import { designTokens, type DesignToken } from '../optics-data.js'
import { extractAllValues, findMatchingToken } from '../utils/css-parser.js'

interface ReplacementSuggestion {
  original: string
  replacement: string
  tokenName: string
  property?: string
}

interface ReplacementResult {
  originalCode: string
  fixedCode: string
  replacements: ReplacementSuggestion[]
  replacementCount: number
}

class ReplaceHardCodedValuesTool extends Tool {
  name = 'replace_hard_coded_values'
  title = 'Replace Hard-Coded Values'
  description = 'Replace hard-coded values with design tokens'

  inputSchema = {
    code: z.string().describe('Code containing hard-coded values'),
    autofix: z.boolean().optional().describe('Whether to automatically fix the code (default: false)'),
  }

  async handler(args: any): Promise<string> {
    const { code, autofix } = args
    const result = this.replaceHardCodedValues(code, designTokens, autofix ?? false)
    return this.formatReplacementSuggestions(result)
  }

  private replaceHardCodedValues(
    code: string,
    tokens: DesignToken[],
    autofix: boolean = false
  ): ReplacementResult {
    const extractedValues = extractAllValues(code)
    const replacements: ReplacementSuggestion[] = []
    let fixedCode = code

    for (const value of extractedValues) {
      const matchingToken = findMatchingToken(value.value, tokens)

      if (matchingToken) {
        const replacement = `var(--${matchingToken})`
        replacements.push({
          original: value.value,
          replacement,
          tokenName: matchingToken,
          property: value.property,
        })

        if (autofix) {
          fixedCode = fixedCode.replace(
            new RegExp(this.escapeRegex(value.value), 'g'),
            replacement
          )
        }
      }
    }

    return {
      originalCode: code,
      fixedCode: autofix ? fixedCode : code,
      replacements,
      replacementCount: replacements.length,
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  private formatReplacementSuggestions(result: ReplacementResult): string {
    const lines: string[] = [
      '# Token Replacement Suggestions',
      '',
      `**Replacements Found**: ${result.replacementCount}`,
      '',
    ]

    if (result.replacements.length > 0) {
      lines.push('## Suggested Replacements')
      lines.push('')

      for (const rep of result.replacements) {
        lines.push(`- Replace \`${rep.original}\` with \`${rep.replacement}\``)
        lines.push(`  Token: ${rep.tokenName}`)
        if (rep.property) lines.push(`  Property: ${rep.property}`)
        lines.push('')
      }

      if (result.fixedCode !== result.originalCode) {
        lines.push('## Fixed Code')
        lines.push('```css')
        lines.push(result.fixedCode)
        lines.push('```')
      }
    } else {
      lines.push('✓ No replacements needed!')
    }

    return lines.join('\n')
  }
}

export default ReplaceHardCodedValuesTool
