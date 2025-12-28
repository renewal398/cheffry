"use client"

import { useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { Post } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { CommentsSheet } from "@/components/comments-sheet"
import { cn } from "@/lib/utils"

interface PostCardProps {
  post: Post
  userId: string
  onInteraction: (postId: string, type: "like" | "dislike") => void
  onRefresh: () => void
}

export function PostCard({ post, userId, onInteraction, onRefresh }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `Post by ${post.profiles?.name}`,
        text: post.content.substring(0, 100),
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start gap-3">
            <Link href={`/profile/${post.profiles?.id}`}>
              <Avatar>
                <AvatarImage src={post.profiles?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {post.profiles?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${post.profiles?.id}`} className="font-medium text-foreground truncate hover:underline">
                  {post.profiles?.name || "Unknown"}
                </Link>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Icons.globe className="h-3 w-3" />
                  {post.country}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-foreground whitespace-pre-wrap">{post.content}</p>
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="mt-3 grid gap-2">
              {post.media_urls.map((url, index) => {
                const isVideo = url?.endsWith(".mp4") || url?.endsWith(".webm") || url?.endsWith(".ogg")
                return isVideo ? (
                  <video
                    key={index}
                    src={url || undefined}
                    controls
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                ) : (
                  <img
                    key={index}
                    src={url || "/placeholder.svg"}
                    alt="Post media"
                    className="rounded-lg max-h-96 w-full object-cover"
                  />
                )
              })}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-1 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onInteraction(post.id, "like")}
              className={cn("gap-1.5", post.user_interaction === "like" && "text-primary")}
            >
              <Icons.like className={cn("h-4 w-4", post.user_interaction === "like" && "fill-current")} />
              <span>{post.likes_count || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onInteraction(post.id, "dislike")}
              className={cn("gap-1.5", post.user_interaction === "dislike" && "text-destructive")}
            >
              <Icons.dislike className={cn("h-4 w-4", post.user_interaction === "dislike" && "fill-current")} />
              <span>{post.dislikes_count || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(true)} className="gap-1.5">
              <Icons.comment className="h-4 w-4" />
              <span>{post.comments_count || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <Icons.share className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentsSheet
        open={showComments}
        onOpenChange={setShowComments}
        postId={post.id}
        userId={userId}
        onCommentAdded={onRefresh}
      />
    </>
  )
}
