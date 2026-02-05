import { z } from 'zod'
import { readResourceFile } from "../_internal/resource-path.js"
import { iconLibraries, suggestLibrary, formatLibraryComparison, formatIconConfig } from '../tools/icons.js'

type ConfigureIconsPromptArgs = {
  library?: string
  needsFill?: boolean
  needsWeight?: boolean
  needsEmphasis?: boolean
  needsDuotone?: boolean
  preferSmallBundle?: boolean
}

export const inputSchema = {
  library: z.string().optional().describe('Icon library name (material, phosphor, tabler, feather, lucide)'),
  needsFill: z.boolean().optional().describe('Requires fill/outlined toggle'),
  needsWeight: z.boolean().optional().describe('Requires weight variations'),
  needsEmphasis: z.boolean().optional().describe('Requires emphasis variations'),
  needsDuotone: z.boolean().optional().describe('Requires duotone icons'),
  preferSmallBundle: z.boolean().optional().describe('Prefer smaller bundle size'),
}

export const metadata = {
  name: "configure-icons",
  title: "Configure Icons",
  description: "Select and configure an icon library for your Optics project",
  role: "user",
}

export async function handler(args: ConfigureIconsPromptArgs) {
  // If specific library requested, return its config
  if (args.library) {
    const lib = iconLibraries.find(l =>
      l.name.toLowerCase().includes(args.library!.toLowerCase()) ||
      l.prefix.toLowerCase().includes(args.library!.toLowerCase())
    )

    if (lib) {
      return formatIconConfig({
        library: lib.name,
        name: 'settings' // example icon
      })
    }
  }

  // If requirements specified, suggest libraries
  if (args.needsFill || args.needsWeight || args.needsEmphasis || args.needsDuotone || args.preferSmallBundle) {
    const suggestions = suggestLibrary({
      needsFill: args.needsFill,
      needsWeight: args.needsWeight,
      needsEmphasis: args.needsEmphasis,
      needsDuotone: args.needsDuotone,
      preferSmallBundle: args.preferSmallBundle,
    })

    if (suggestions.length === 0) {
      return `No icon libraries match all your requirements.\n\n${formatLibraryComparison()}`
    }

    let output = `## Recommended Libraries\n\n`
    for (const lib of suggestions) {
      output += `### ${lib.name}\n`
      output += `- Import: \`${lib.import}\`\n`
      output += `- Usage: \`${lib.usage}\`\n`
      if (lib.notes) output += `- Notes: ${lib.notes}\n`
      output += `\n`
    }
    return output
  }

  // Default: return full comparison from prompt template
  const promptTemplate = await readResourceFile("prompts/configure-icons-prompt.md")
  return promptTemplate
}
