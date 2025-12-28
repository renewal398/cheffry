import { generateObject } from "ai"
import { z } from "zod"

const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
    time: z.string(),
    servings: z.string(),
  }),
})

export async function POST(req: Request) {
  const { meal, ingredients, country }: { meal: string; ingredients: string[]; country: string } = await req.json()

  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: recipeSchema,
    prompt: `You are a professional chef. Create a detailed recipe for the following dish.

Dish Name: ${meal}
Country/Cuisine Style: ${country}
Available Ingredients: ${ingredients.join(", ")}

Requirements:
- ONLY use the provided ingredients (basic pantry staples like salt, pepper, oil, water are assumed available)
- Provide clear, step-by-step instructions that a home cook can follow
- Include preparation tips and cooking techniques
- Make the recipe authentic to ${country} cuisine style
- Each step should be detailed but concise

Generate the complete recipe:`,
    maxOutputTokens: 1500,
  })

  return Response.json(object)
}
