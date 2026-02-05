import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { designTokens } from '../optics-data.js'

class GetTokenUsageStatsTool extends Tool {
  name = 'get_token_usage_stats'
  title = 'Get Token Usage Stats'
  description = 'Get statistics about design token usage across the system'

  inputSchema = {}

  async handler(args: ToolInputSchema): Promise<string> {
    const stats = this.getTokenUsageStats()

    return JSON.stringify(stats, null, 2)
  }

  private getTokenUsageStats() {
    const categoryCount: Record<string, number> = {};

    designTokens.forEach(token => {
      categoryCount[token.category] = (categoryCount[token.category] || 0) + 1;
    });

    return {
      totalTokens: designTokens.length,
      categories: categoryCount,
      tokens: designTokens
    }
  }
}

export default GetTokenUsageStatsTool
