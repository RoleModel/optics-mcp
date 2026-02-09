/**
 * Validate Color Pair Tool
 * Validates if a given background and foreground color token pair is valid based on the design system's naming conventions.
 */

import { z } from 'zod'
import Tool, { type ToolInputSchema } from './tool.js'

interface ToolResponse {
  valid: boolean
  validForegroundTokens: string[]
}

interface ToolErrorResponse {
  valid: boolean
  errorMessage: string
}

class ValidateColorPairTool extends Tool {
  name = 'validate_color_pair'
  title = 'Validate Color Pair'
  description = 'Check if the pair is meant to be used together'

  inputSchema = {
    backgroundToken: z.string().describe('Background color token name'),
    foregroundToken: z.string().describe('Foreground color token name'),
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const { backgroundToken, foregroundToken } = args

    const response = this.getResponse(backgroundToken, foregroundToken)

    return JSON.stringify(response, null, 2)
  }

  getResponse(backgroundToken: string, foregroundToken: string): ToolResponse | ToolErrorResponse {
    const validForegroundTokens = this.getValidForegroundTokens(backgroundToken)
    const valid = validForegroundTokens.includes(foregroundToken)

    if (validForegroundTokens.length === 0) {
      return {
        valid: false,
        errorMessage: 'The given background token is not valid.'
      }
    }

    return { valid, validForegroundTokens }
  }

  getValidForegroundTokens(backgroundToken: string): string[] {
    // Insert '-on-' after the segment before the last two (e.g. op-color-alerts-neutral-plus-one -> op-color-alerts-neutral-on-plus-one)
    const backgroundParts = backgroundToken.split('-');
    if (backgroundParts.length < 4) return [];

    // For tokens with 4 segments, insert after 3rd; for more, insert after (length - 2)th
    const insertAt = backgroundParts.length > 4 ? backgroundParts.length - 2 : 3
    const onParts = [...backgroundParts]
    onParts.splice(insertAt, 0, 'on')

    const onToken = onParts.join('-')
    const onAltToken = `${onToken}-alt`

    return [onToken, onAltToken]
  }
}

export default ValidateColorPairTool
