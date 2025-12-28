// services/geminiservice.ts
// CLIENT-SIDE ONLY — safe to import in "use client" components

export interface RecipeResponse {
  recipeName: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
}

export async function getRecipeSuggestions(
  ingredients: string,
  country: string
): Promise<RecipeResponse[]> {
  try {
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients, country }),
    });

    if (!res.ok) {
      console.error("API route failed:", res.status);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Client fetch failed:", error);
    return [];
  }
}
