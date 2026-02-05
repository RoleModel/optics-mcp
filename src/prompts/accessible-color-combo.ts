import { z } from 'zod'
import { readPromptFile } from "../_internal/resource-path.js"

/**
 * Prompt: Accessible Color Combo
 */
export const inputSchema = {
  colorFamily: z.string().describe('Color family (primary, neutral, danger, warning, info, notice)'),
  wcagLevel: z.string().optional().describe('WCAG level (AA or AAA)'),
}

type AccessibleColorComboPromptArgs = {
  colorFamily: string
  wcagLevel?: string
}

export const metadata = {
  name: "accessible-color-combo",
  title: "Accessible Color Combo",
  description: "Suggest accessible foreground/background color token combinations",
  role: "user",
}

export async function handler(args: AccessibleColorComboPromptArgs) {
  const family = args.colorFamily || 'primary'
  const level = args.wcagLevel || 'AA'

  let promptTemplate = await readPromptFile("accessible-color-combo-prompt.md")
  promptTemplate = promptTemplate.replace(/{{FAMILY}}/g, family)
  promptTemplate = promptTemplate.replace(/{{LEVEL}}/g, level)
  return promptTemplate
}
