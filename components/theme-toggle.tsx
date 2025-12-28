"use client"

import { useTheme } from "next-themes"
import { Icons } from "@/components/icons"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="flex w-full items-center">
      <Icons.sun className="mr-2 h-4 w-4 dark:hidden" />
      <Icons.moon className="mr-2 h-4 w-4 hidden dark:block" />
      <span className="dark:hidden">Dark mode</span>
      <span className="hidden dark:block">Light mode</span>
    </button>
  )
}
