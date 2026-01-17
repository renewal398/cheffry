"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { UserPostCard } from "@/components/user-post-card"
import { Icons } from "@/components/icons"

interface UserPostsProps {
  userId: string
}

export function UserPosts({ userId }: UserPostsProps) {
  const posts = useQuery(api.posts.getByUserId, { userId: userId as any })

  if (posts === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Icons.utensils className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">No posts yet</h3>
        <p className="text-sm text-muted-foreground">Share your first cooking creation!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post: any) => (
        <UserPostCard key={post._id} post={post} onRefresh={() => {}} />
      ))}
    </div>
  )
}
