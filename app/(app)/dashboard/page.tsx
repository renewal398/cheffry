import React, { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Feed } from "@/components/feed"
import { FeedSkeleton } from "@/components/feed-skeleton"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single()

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <Link href="/profile">
          <Avatar className="h-9 w-9">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {profile?.name?.charAt(0).toUpperCase() || user!.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <h1 className="text-xl font-semibold text-foreground">Feed</h1>
      </header>

      {/* Feed */}
      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <Suspense fallback={<FeedSkeleton />}>
            <Feed userId={user!.id} userCountry={profile?.country || "Unknown"} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
