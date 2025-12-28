"use client"

import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Icons } from "@/components/icons"

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex flex-col gap-3">
      <Label>Theme</Label>
      <RadioGroup value={theme} onValueChange={setTheme} className="flex gap-4">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="light" id="light" />
          <Label htmlFor="light" className="flex items-center gap-2 cursor-pointer font-normal">
            <Icons.sun className="h-4 w-4" />
            Light
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="dark" id="dark" />
          <Label htmlFor="dark" className="flex items-center gap-2 cursor-pointer font-normal">
            <Icons.moon className="h-4 w-4" />
            Dark
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="system" id="system" />
          <Label htmlFor="system" className="cursor-pointer font-normal">
            System
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
