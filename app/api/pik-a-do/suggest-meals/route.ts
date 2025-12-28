import { generateObject } from "ai"
import { z } from "zod"

const mealsSchema = z.object({
  meals: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      time: z.string(),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),
})

export async function POST(req: Request) {
  const { country, ingredients }: { country: string; ingredients: string[] } = await req.json()

  const { object } = await generateObject({
    model: "openai/gpt-4o-mini",
    schema: mealsSchema,
    prompt: `You are a culinary expert. Based on the following ingredients and cuisine style, suggest 4-6 meals that can be made.

Country/Cuisine: ${country}
Available Ingredients: ${ingredients.join(", ")}

Requirements:
- ONLY suggest meals that can be made with the given ingredients (basic pantry staples like salt, pepper, oil are assumed available)
- Focus on dishes that are popular or traditional in ${country}
- Provide realistic cooking times
- Vary the difficulty levels

Generate meal suggestions:`,
    maxOutputTokens: 1000,
  })

  return Response.json(object)
}
