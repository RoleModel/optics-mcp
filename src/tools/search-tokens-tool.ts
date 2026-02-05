import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { designTokens } from '../optics-data.js'

class SearchTokensTool extends Tool {
  name = 'search_tokens'
  title = 'Search Tokens'
  description = 'Search for design tokens by category or name pattern'

  inputSchema = {
    category: z
      .string()
      .optional()
      .describe('Filter by category (color, spacing, typography, border, shadow)'),
    namePattern: z
      .string()
      .optional()
      .describe('Search pattern for token names (case-insensitive)')
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const { category, namePattern } = args
    let filtered = designTokens;

    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (namePattern) {
      const pattern = namePattern.toLowerCase();
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(pattern)
      );
    }

    return JSON.stringify(filtered, null, 2)
  }
}

export default SearchTokensTool
