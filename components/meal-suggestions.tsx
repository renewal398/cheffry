"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface Meal {
  name: string
  description: string
  time: string
  difficulty: string
}

interface MealSuggestionsProps {
  meals: Meal[]
  onSelectMeal: (meal: Meal) => void
  isLoading: boolean
}

export function MealSuggestions({ meals, onSelectMeal, isLoading }: MealSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (meals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Icons.utensils className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium text-foreground">No meals found</h3>
          <p className="text-sm text-muted-foreground">Try selecting different ingredients</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Meals</CardTitle>
        <CardDescription>Based on your ingredients, here are some dishes you can make</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {meals.map((meal, index) => (
            <button
              key={index}
              onClick={() => onSelectMeal(meal)}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border border-border p-4 text-left transition-colors",
                "hover:bg-accent hover:border-primary/50",
              )}
            >
              <h4 className="font-medium text-foreground">{meal.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{meal.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2">
                <span className="flex items-center gap-1">
                  <Icons.clock className="h-3 w-3" />
                  {meal.time}
                </span>
                <span className="capitalize">{meal.difficulty}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
