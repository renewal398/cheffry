"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

interface CreatePostButtonProps {
  userCountry: string
  onPostCreated?: () => void
}

export function CreatePostButton({ userCountry, onPostCreated }: CreatePostButtonProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const files = Array.from(e.target.files || [])

    // Validate video duration
    for (const file of files) {
      if (file.type.startsWith("video/")) {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src)
          if (video.duration > 45) {
            setError("Videos cannot be longer than 45 seconds.")
            return
          }
        }
        video.src = URL.createObjectURL(file)
      }
    }

    setMediaFiles(files)
    setMediaPreviews(files.map((file) => URL.createObjectURL(file)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    setError(null)
    const supabase = createClient()

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new Error("You must be logged in to post.")
      }

      const mediaUrls: string[] = []
      if (mediaFiles.length > 0) {
        const uploadPromises = mediaFiles.map((file) => {
          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`
          return supabase.storage.from("posts").upload(fileName, file, { upsert: true })
        })

        const uploadResults = await Promise.all(uploadPromises)

        const uploadError = uploadResults.find((result) => result.error)
        if (uploadError) {
          throw uploadError.error
        }

        for (const result of uploadResults) {
          if (result.data) {
            const { data } = supabase.storage.from("posts").getPublicUrl(result.data.path)
            mediaUrls.push(data.publicUrl)
          }
        }
      }

      const { error: insertError } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim(),
        country: userCountry,
        media_urls: mediaUrls,
      })

      if (insertError) {
        throw insertError
      }

      setContent("")
      setMediaFiles([])
      setMediaPreviews([])
      setOpen(false)
      onPostCreated?.()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Icons.plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
          <DialogDescription>Share your cooking creations with the community</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="What are you cooking today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  {mediaFiles[index].type.startsWith("video/") ? (
                    <video src={preview} controls className="rounded-md" />
                  ) : (
                    <img src={preview} alt="Media preview" className="rounded-md" />
                  )}
                </div>
              ))}
            </div>
          )}
          {error && <p className="text-xs text-destructive">{error}</p>}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleMediaChange}
                className="hidden"
                accept="image/*,video/*"
                multiple
              />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 p-0 bg-transparent">
                <Icons.upload className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Icons.globe className="h-3 w-3" />
                <span>Posting from {userCountry}</span>
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
