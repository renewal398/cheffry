"use client"

import React from "react"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import type { Comment } from "@/lib/types"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface CommentsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  userId: string
  onCommentAdded: () => void
}

export function CommentsSheet({ open, onOpenChange, postId, userId, onCommentAdded }: CommentsSheetProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      fetchComments()
    }
  }, [open, postId])

  const fetchComments = async () => {
    setIsLoading(true)
    const supabase = createClient()

    const { data } = await supabase
      .from("comments")
      .select(`
        *,
        profiles:user_id (id, name, avatar_url, country)
      `)
      .eq("post_id", postId)
      .order("created_at", { ascending: true })

    setComments(data || [])
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setIsSubmitting(true)
    const supabase = createClient()

    await supabase.from("comments").insert({
      post_id: postId,
      user_id: userId,
      content: newComment.trim(),
    })

    setNewComment("")
    fetchComments()
    onCommentAdded()
    setIsSubmitting(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Icons.spinner className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Icons.comment className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No comments yet</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {comment.profiles?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.profiles?.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2 pt-4 border-t border-border">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[60px] resize-none"
          />
          <Button type="submit" size="icon" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? <Icons.spinner className="h-4 w-4 animate-spin" /> : <Icons.send className="h-4 w-4" />}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
