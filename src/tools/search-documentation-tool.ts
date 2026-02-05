import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { documentation } from '../optics-data.js'

class SearchDocumentationTool extends Tool {
  name = 'search_documentation'
  title = 'Search Documentation'
  description = 'Search through Optics documentation'

  inputSchema = {
    query: z
      .string()
      .describe('Search query for documentation content')
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const { query } = args
    const results = documentation.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase()) ||
        doc.section.toLowerCase().includes(query.toLowerCase())
    )

    return JSON.stringify(results, null, 2)
  }
}

export default SearchDocumentationTool
