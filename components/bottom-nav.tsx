"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Feed", icon: Icons.home },
  { href: "/profile", label: "Profile", icon: Icons.user },
  { href: "/chef", label: "Chef AI", icon: Icons.chef },
  { href: "/pik-a-do", label: "Pik-a-Do", icon: Icons.utensils },
  { href: "/settings", label: "Settings", icon: Icons.settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-5 mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted",
              pathname === item.href && "text-primary",
            )}
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
