import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/icons"

interface Recipe {
  name: string
  ingredients: string[]
  steps: string[]
  time: string
  servings: string
}

interface RecipeViewProps {
  recipe: Recipe
}

export function RecipeView({ recipe }: RecipeViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{recipe.name}</CardTitle>
        <CardDescription className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Icons.clock className="h-4 w-4" />
            {recipe.time}
          </span>
          <span className="flex items-center gap-1">
            <Icons.user className="h-4 w-4" />
            {recipe.servings}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {/* Ingredients */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Ingredients</h3>
          <div className="flex flex-wrap gap-2">
            {recipe.ingredients.map((ingredient, index) => (
              <Badge key={index} variant="outline" className="bg-transparent">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-semibold text-foreground mb-3">Instructions</h3>
          <ol className="flex flex-col gap-4">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </span>
                <p className="text-foreground pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}
