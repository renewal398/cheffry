"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

// Common ingredients by category
const ingredientCategories = {
  Proteins: ["Chicken", "Beef", "Pork", "Fish", "Shrimp", "Tofu", "Eggs", "Lamb"],
  Vegetables: [
    "Onion",
    "Garlic",
    "Tomato",
    "Potato",
    "Carrot",
    "Bell Pepper",
    "Broccoli",
    "Spinach",
    "Mushroom",
    "Zucchini",
  ],
  Grains: ["Rice", "Pasta", "Bread", "Flour", "Noodles", "Quinoa", "Oats"],
  Dairy: ["Milk", "Cheese", "Butter", "Yogurt", "Cream"],
  Herbs: ["Basil", "Cilantro", "Parsley", "Thyme", "Rosemary", "Oregano", "Mint"],
  Pantry: ["Olive Oil", "Soy Sauce", "Vinegar", "Sugar", "Salt", "Pepper", "Honey", "Lemon"],
}

interface IngredientSelectorProps {
  country: string
  selectedIngredients: string[]
  onSelectionChange: (ingredients: string[]) => void
}

export function IngredientSelector({ country, selectedIngredients, onSelectionChange }: IngredientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [customIngredient, setCustomIngredient] = useState("")

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      onSelectionChange(selectedIngredients.filter((i) => i !== ingredient))
    } else {
      onSelectionChange([...selectedIngredients, ingredient])
    }
  }

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      onSelectionChange([...selectedIngredients, customIngredient.trim()])
      setCustomIngredient("")
    }
  }

  const filteredCategories = Object.entries(ingredientCategories).reduce(
    (acc, [category, ingredients]) => {
      const filtered = ingredients.filter((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      if (filtered.length > 0) {
        acc[category] = filtered
      }
      return acc
    },
    {} as Record<string, string[]>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Ingredients</CardTitle>
        <CardDescription>Choose the ingredients you have available for {country} cuisine</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Selected ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
            {selectedIngredients.map((ingredient) => (
              <Badge key={ingredient} variant="secondary" className="gap-1 pr-1 cursor-pointer hover:bg-destructive/20">
                {ingredient}
                <button onClick={() => toggleIngredient(ingredient)} className="ml-1 rounded-full hover:bg-background">
                  <Icons.close className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Search and custom ingredient */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom..."
              value={customIngredient}
              onChange={(e) => setCustomIngredient(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomIngredient()}
              className="w-32"
            />
            <button
              type="button"
              onClick={addCustomIngredient}
              disabled={!customIngredient.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
            >
              <Icons.plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Ingredient categories */}
        <div className="flex flex-col gap-4 max-h-[400px] overflow-auto">
          {Object.entries(filteredCategories).map(([category, ingredients]) => (
            <div key={category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
              <div className="flex flex-wrap gap-2">
                {ingredients.map((ingredient) => (
                  <Badge
                    key={ingredient}
                    variant={selectedIngredients.includes(ingredient) ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors",
                      selectedIngredients.includes(ingredient)
                        ? "bg-primary hover:bg-primary/90"
                        : "hover:bg-accent bg-transparent",
                    )}
                    onClick={() => toggleIngredient(ingredient)}
                  >
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
