"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Post } from "@/lib/types"
import { PostCard } from "@/components/post-card"
import { CreatePostButton } from "@/components/create-post-button"
import { Icons } from "@/components/icons"

interface FeedProps {
  userId: string
  userCountry: string
}

export function Feed({ userId, userCountry }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    const supabase = createClient()
    setIsLoading(true)
    const { data, error } = await supabase.rpc("get_feed", {
      p_user_id: userId,
      p_user_country: userCountry,
    })

    if (error) {
      console.error(error)
      setPosts([])
    } else {
      setPosts(data as Post[])
    }
    setIsLoading(false)
  }, [userId, userCountry])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleInteraction = (postId: string, type: "like" | "dislike") => {
    const originalPosts = [...posts]
    const postIndex = posts.findIndex((p) => p.id === postId)
    if (postIndex === -1) return

    const post = { ...posts[postIndex] }
    const currentInteraction = post.user_interaction

    const updatedPosts = [...posts]
    updatedPosts[postIndex] = { ...post }

    const newInteractionType = currentInteraction === type ? null : type

    updatedPosts[postIndex].user_interaction = newInteractionType

    if (currentInteraction === "like") updatedPosts[postIndex].likes_count--
    if (currentInteraction === "dislike") updatedPosts[postIndex].dislikes_count--

    if (newInteractionType === "like") updatedPosts[postIndex].likes_count++
    if (newInteractionType === "dislike") updatedPosts[postIndex].dislikes_count++

    setPosts(updatedPosts)

    // DB updates in background
    const supabase = createClient()
    ;(async () => {
      if (post.profiles?.country) {
        await supabase.rpc("increment_country_interaction", {
          p_user_id: userId,
          p_country: post.profiles.country,
        })
      }

      if (newInteractionType === null) {
        await supabase.from("interactions").delete().eq("user_id", userId).eq("post_id", postId)
      } else {
        await supabase
          .from("interactions")
          .upsert({ user_id: userId, post_id: postId, type: newInteractionType }, { onConflict: "user_id,post_id" })
      }
    })().catch((error) => {
      console.error("Failed to update interaction:", error)
      setPosts(originalPosts) // Revert on error
    })
  }

  if (isLoading) {
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
      <CreatePostButton userCountry={userCountry} onPostCreated={fetchPosts} />
      {posts.map((post) => (
        <PostCard key={post.id} post={post} userId={userId} onInteraction={handleInteraction} onRefresh={fetchPosts} />
      ))}
    </div>
  )
}
