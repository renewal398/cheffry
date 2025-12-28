import React, { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ProfileHeader } from "@/components/profile-header"
import { UserPosts } from "@/components/user-posts"
import { FeedSkeleton } from "@/components/feed-skeleton"

export default async function UserProfilePage({ params }: { params: { userId: string } }) {
  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", params.userId).single()

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold text-foreground">{profile?.name || "Profile"}</h1>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <ProfileHeader profile={profile} />

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Posts</h2>
            <Suspense fallback={<FeedSkeleton />}>
              <UserPosts userId={params.userId} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
