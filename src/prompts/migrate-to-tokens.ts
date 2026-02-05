import { z } from 'zod'
import { readPromptFile } from "../_internal/resource-path.js"

/**
 * Prompt: Migrate to Tokens
 */
export const inputSchema = {
  code: z.string().describe('CSS or component code with hard-coded values')
}

type MigrateToTokensPromptArgs = {
  code: string
}

export const metadata = {
  name: "migrate-to-tokens",
  title: "Migrate to Tokens",
  description: "Convert hard-coded CSS values to Optics design tokens",
  role: "user",
}

export async function handler(args: MigrateToTokensPromptArgs) {
  const { code } = args

  let promptTemplate = await readPromptFile("migrate-to-tokens.md")
  promptTemplate = promptTemplate.replace(/{{CODE}}/g, code || '')
  return promptTemplate
}
