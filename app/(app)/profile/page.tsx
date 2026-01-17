import React, { Suspense } from "react"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { ProfileHeader } from "@/components/profile-header"
import { UserPosts } from "@/components/user-posts"
import { FeedSkeleton } from "@/components/feed-skeleton"

export default async function ProfilePage() {
  const token = await convexAuthNextjsToken()
  const profile: any = await fetchQuery(api.users.viewer, {}, { token })

  return (
    <div className="flex flex-col h-screen">
      

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <ProfileHeader profile={profile} />

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">Your Posts</h2>
            <Suspense fallback={<FeedSkeleton />}>
              <UserPosts userId={profile?._id} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
