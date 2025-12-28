"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Post } from "@/lib/types"
import { UserPostCard } from "@/components/user-post-card"
import { Icons } from "@/components/icons"

interface UserPostsProps {
  userId: string
}

export function UserPosts({ userId }: UserPostsProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPosts = useCallback(async () => {
    const supabase = createClient()

    const { data: postsData } = await supabase
      .from("posts")
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, country)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!postsData) {
      setIsLoading(false)
      return
    }

    const postIds = postsData.map((p) => p.id)

    const { data: interactions } = await supabase.from("interactions").select("post_id, type").in("post_id", postIds)

    const { data: comments } = await supabase.from("comments").select("post_id").in("post_id", postIds)

    const enrichedPosts = postsData.map((post) => {
      const postInteractions = interactions?.filter((i) => i.post_id === post.id) || []
      const likesCount = postInteractions.filter((i) => i.type === "like").length
      const dislikesCount = postInteractions.filter((i) => i.type === "dislike").length
      const commentsCount = comments?.filter((c) => c.post_id === post.id).length || 0

      return {
        ...post,
        likes_count: likesCount,
        dislikes_count: dislikesCount,
        comments_count: commentsCount,
      }
    })

    setPosts(enrichedPosts)
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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
        <p className="text-sm text-muted-foreground">Share your first cooking creation!</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <UserPostCard key={post.id} post={post} onRefresh={fetchPosts} />
      ))}
    </div>
  )
}
