import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { designTokens } from '../optics-data.js'

class GetTokenTool extends Tool {
  name = 'get_token'
  title = 'Get Token'
  description = 'Get detailed information about a specific design token by name'

  inputSchema = {
    tokenName: z
      .string()
      .describe('The name of the design token (e.g., "color-primary", "spacing-md")'),
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const { tokenName } = args

    const token = designTokens.find((t) => t.name === tokenName)

    if (!token) {
      return `Token not found: ${tokenName}\n\nAvailable tokens: ${designTokens.map((t) => t.name).join(', ')}`
    }

    return JSON.stringify(token, null, 2)
  }
}

export default GetTokenTool
