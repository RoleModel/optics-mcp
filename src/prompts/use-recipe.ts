import { z } from 'zod'
import { getRecipe, searchRecipes, formatRecipe, formatRecipeList, getRecipeCategories } from '../tools/recipes.js'
import { readResourceFile } from "../_internal/resource-path.js"

type UseRecipePromptArgs = {
  slug?: string
  category?: string
  query?: string
}

export const inputSchema = {
  slug: z.string().optional().describe('Specific recipe slug to retrieve'),
  category: z.string().optional().describe('Filter by category (layout, sidebar, header, component)'),
  query: z.string().optional().describe('Search term for recipe name or description'),
}

export const metadata = {
  name: "use-recipe",
  title: "Use Recipe",
  description: "Get Optics customization recipes with CSS and HTML patterns",
  role: "user",
}

export async function handler(args: UseRecipePromptArgs) {
  // If specific recipe requested
  if (args.slug) {
    const recipe = getRecipe(args.slug)

    if (recipe) {
      return formatRecipe(recipe)
    }

    // Recipe not found - show available
    const allRecipes = searchRecipes()
    return `Recipe not found: ${args.slug}\n\n${formatRecipeList(allRecipes)}`
  }

  // If searching/filtering
  if (args.category || args.query) {
    const results = searchRecipes(args.query, args.category)
    return formatRecipeList(results)
  }

  // Default: return overview from template
  const promptTemplate = await readResourceFile("prompts/use-recipe-prompt.md")
  return promptTemplate
}
