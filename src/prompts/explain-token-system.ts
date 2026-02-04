import { z } from 'zod'
import { designTokens } from '../optics-data.js'
import { readResourceFile } from "../_internal/resource-path.js"

type ExplainTokenSystemPromptArgs = {
  category: string
}

export const inputSchema = {
  category: z.string().describe('Token category (color, spacing, typography, border, shadow)'),
}

export const metadata = {
  name: "explain-token-system",
  title: "Explain Token System",
  description: "Explain how a specific token category works in Optics",
  role: "user",
}

export async function handler(args: ExplainTokenSystemPromptArgs) {
  const cat = args.category || 'color';
  const tokens = designTokens.filter((t) => t.category === cat);

  const firstTenTokensListed = tokens.slice(0, 10).map((t) => `- ${t.name}: ${t.description}`).join('\n')
  const remainingTokenCount = (tokens.length > 10 ? '\n... and ' + (tokens.length - 10) + ' more' : '')


  let promptTemplate = await readResourceFile("prompts/explain-token-system-prompt.md")
  promptTemplate = promptTemplate.replace(/{{CATEGORY}}/g, cat)
  promptTemplate = promptTemplate.replace(/{{TOKEN_COUNT}}/g, tokens.length.toString())
  promptTemplate = promptTemplate.replace(/{{TOKENS}}/g, firstTenTokensListed + remainingTokenCount)
  return promptTemplate
}
