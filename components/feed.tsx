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

    // Fetch posts with profile info
    const { data: postsData } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, country)
      `)
      .order("created_at", { ascending: false })
      .limit(50)

    if (!postsData) {
      setIsLoading(false)
      return
    }

    // Get user's country interactions for prioritization
    const { data: countryInteractions } = await supabase
      .from("user_country_interactions")
      .select("country, interaction_count")
      .eq("user_id", userId)
      .order("interaction_count", { ascending: false })

    // Get interactions count for each post
    const postIds = postsData.map((p) => p.id)

    const { data: interactions } = await supabase.from("interactions").select("post_id, type").in("post_id", postIds)

    // Get user's interactions
    const { data: userInteractions } = await supabase
      .from("interactions")
      .select("post_id, type")
      .eq("user_id", userId)
      .in("post_id", postIds)

    // Get comment counts
    const { data: comments } = await supabase.from("comments").select("post_id").in("post_id", postIds)

    // Map interactions and comments to posts
    const enrichedPosts = postsData.map((post) => {
      const postInteractions = interactions?.filter((i) => i.post_id === post.id) || []
      const likesCount = postInteractions.filter((i) => i.type === "like").length
      const dislikesCount = postInteractions.filter((i) => i.type === "dislike").length
      const commentsCount = comments?.filter((c) => c.post_id === post.id).length || 0
      const userInteraction = userInteractions?.find((i) => i.post_id === post.id)?.type as
        | "like"
        | "dislike"
        | null
        | undefined

      return {
        ...post,
        likes_count: likesCount,
        dislikes_count: dislikesCount,
        comments_count: commentsCount,
        user_interaction: userInteraction || null,
      }
    })

    // Prioritization logic
    const interactedCountries = countryInteractions?.map((c) => c.country) || []

    const sortedPosts = enrichedPosts.sort((a, b) => {
      const aCountry = a.country
      const bCountry = b.country

      // User's country first
      if (aCountry === userCountry && bCountry !== userCountry) return -1
      if (bCountry === userCountry && aCountry !== userCountry) return 1

      // Then by interaction count
      const aInteractionIndex = interactedCountries.indexOf(aCountry)
      const bInteractionIndex = interactedCountries.indexOf(bCountry)

      if (aInteractionIndex !== -1 && bInteractionIndex === -1) return -1
      if (bInteractionIndex !== -1 && aInteractionIndex === -1) return 1
      if (aInteractionIndex !== -1 && bInteractionIndex !== -1) {
        return aInteractionIndex - bInteractionIndex
      }

      // Finally by date
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    setPosts(sortedPosts)
    setIsLoading(false)
  }, [userId, userCountry])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleInteraction = async (postId: string, type: "like" | "dislike") => {
    const supabase = createClient()
    const post = posts.find((p) => p.id === postId)
    if (!post) return

    // Track country interaction
    if (post.profiles?.country) {
      await supabase.rpc("increment_country_interaction", {
        p_user_id: userId,
        p_country: post.profiles.country,
      })
    }

    // Update or remove interaction
    if (post.user_interaction === type) {
      // Remove interaction
      await supabase.from("interactions").delete().eq("user_id", userId).eq("post_id", postId)
    } else {
      // Upsert interaction
      await supabase.from("interactions").upsert(
        {
          user_id: userId,
          post_id: postId,
          type,
        },
        { onConflict: "user_id,post_id" },
      )
    }

    // Refresh feed
    fetchPosts()
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
