import React, { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ProfileHeader } from "@/components/profile-header"
import { UserPosts } from "@/components/user-posts"
import { FeedSkeleton } from "@/components/feed-skeleton"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single()

  return (
    <div className="flex flex-col h-screen">
      

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <ProfileHeader profile={profile} />

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Posts</h2>
            <Suspense fallback={<FeedSkeleton />}>
              <UserPosts userId={user!.id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
