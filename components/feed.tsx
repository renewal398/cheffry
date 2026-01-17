"use client"

import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PostCard } from "@/components/post-card"
import { CreatePostButton } from "@/components/create-post-button"
import { Icons } from "@/components/icons"

interface FeedProps {
  userId: string
  userCountry: string
}

export function Feed({ userId, userCountry }: FeedProps) {
  const posts = useQuery(api.posts.list, { userCountry })
  const toggleInteraction = useMutation(api.interactions.toggleInteraction)

  const handleInteraction = async (postId: any, type: "like" | "dislike") => {
    await toggleInteraction({ postId, type })
  }

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
        <p className="text-sm text-muted-foreground">Be the first to share your cooking!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <CreatePostButton userCountry={userCountry} onPostCreated={() => {}} />
      {posts.map((post: any) => (
        <PostCard key={post._id} post={post} userId={userId} onInteraction={handleInteraction} onRefresh={() => {}} />
      ))}
    </div>
  )
}
