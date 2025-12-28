import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { ingredients, country } = await req.json();

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key missing" },
      { status: 500 }
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
     contents: `
You are a master chef specializing in traditional ${country} cuisine.
The user has ONLY these ingredients: ${ingredients}.

Suggest 3 authentic ${country} dishes that can be prepared using ONLY the provided ingredients.

For each dish:
1. Give a clear dish name in "recipeName".
2. List all required ingredients in "ingredients".
3. Provide **detailed, step-by-step instructions** in "instructions". Each step should be **a single action**, and aim for **at least 8–12 steps if needed to fully cook the dish**.
4. Include cooking time in "cookingTime".

ABSOLUTE CONSTRAINTS:
- FORBIDDEN: Do not list recipes requiring ingredients not provided.
- PERMITTED EXCEPTION: You may assume ONLY water, salt, black pepper, seasoning, and cooking oil.
- CULTURAL AUTHENTICITY: Dishes must be recognized as part of ${country}'s local food culture.
`,

      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              recipeName: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              cookingTime: { type: Type.STRING }
            },
            required: [
              "recipeName",
              "ingredients",
              "instructions",
              "cookingTime"
            ]
          }
        }
      }
    });

    return NextResponse.json(JSON.parse(response.text));
  } catch (error) {
    console.error("Gemini error:", error);
    return NextResponse.json(
      { error: "Gemini failed" },
      { status: 500 }
    );
  }
}
