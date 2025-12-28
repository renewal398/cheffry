"use client"

import { useState } from "react"
import { countries } from "@/lib/countries"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Icons } from "@/components/icons"
import { IngredientSelector } from "@/components/ingredient-selector"
import { MealSuggestions } from "@/components/meal-suggestions"
import { RecipeView } from "@/components/recipe-view"

type Step = "country" | "ingredients" | "meals" | "recipe"

interface Meal {
  name: string
  description: string
  time: string
  difficulty: string
}

interface Recipe {
  name: string
  ingredients: string[]
  steps: string[]
  time: string
  servings: string
}

interface PikADoWizardProps {
  userCountry: string
}

export function PikADoWizard({ userCountry }: PikADoWizardProps) {
  const [step, setStep] = useState<Step>("country")
  const [selectedCountry, setSelectedCountry] = useState(userCountry)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [suggestedMeals, setSuggestedMeals] = useState<Meal[]>([])
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCountrySelect = () => {
    setStep("ingredients")
  }

  const handleIngredientsSubmit = async () => {
    if (selectedIngredients.length === 0) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/pik-a-do/suggest-meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          ingredients: selectedIngredients,
        }),
      })
      const data = await response.json()
      setSuggestedMeals(data.meals)
      setStep("meals")
    } catch (error) {
      console.error("Failed to get meal suggestions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMealSelect = async (meal: Meal) => {
    setSelectedMeal(meal)
    setIsLoading(true)
    try {
      const response = await fetch("/api/pik-a-do/get-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meal: meal.name,
          ingredients: selectedIngredients,
          country: selectedCountry,
        }),
      })
      const data = await response.json()
      setRecipe(data.recipe)
      setStep("recipe")
    } catch (error) {
      console.error("Failed to get recipe:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    switch (step) {
      case "ingredients":
        setStep("country")
        break
      case "meals":
        setStep("ingredients")
        break
      case "recipe":
        setStep("meals")
        setRecipe(null)
        break
    }
  }

  const handleStartOver = () => {
    setStep("country")
    setSelectedCountry(userCountry)
    setSelectedIngredients([])
    setSuggestedMeals([])
    setSelectedMeal(null)
    setRecipe(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {["country", "ingredients", "meals", "recipe"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                step === s
                  ? "bg-primary"
                  : ["country", "ingredients", "meals", "recipe"].indexOf(step) > i
                    ? "bg-primary/50"
                    : "bg-muted"
              }`}
            />
            {i < 3 && <div className="h-0.5 w-8 bg-muted" />}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === "country" && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Select Your Cuisine</CardTitle>
            <CardDescription>Choose a country to explore its local ingredients and dishes</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCountrySelect} disabled={!selectedCountry}>
              Continue
              <Icons.chevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "ingredients" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <Icons.back className="mr-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">Cuisine: {selectedCountry}</span>
          </div>

          <IngredientSelector
            country={selectedCountry}
            selectedIngredients={selectedIngredients}
            onSelectionChange={setSelectedIngredients}
          />

          <Button onClick={handleIngredientsSubmit} disabled={selectedIngredients.length === 0 || isLoading}>
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Finding meals...
              </>
            ) : (
              <>
                Suggest Meals ({selectedIngredients.length} ingredients)
                <Icons.chevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {step === "meals" && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <Icons.back className="mr-2 h-4 w-4" />
              Back
            </Button>
            <span className="text-sm text-muted-foreground">{selectedIngredients.length} ingredients selected</span>
          </div>

          <MealSuggestions meals={suggestedMeals} onSelectMeal={handleMealSelect} isLoading={isLoading} />
        </div>
      )}

      {step === "recipe" && recipe && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <Icons.back className="mr-2 h-4 w-4" />
              Back to meals
            </Button>
            <Button variant="outline" size="sm" onClick={handleStartOver} className="bg-transparent">
              Start over
            </Button>
          </div>

          <RecipeView recipe={recipe} />
        </div>
      )}
    </div>
  )
}
