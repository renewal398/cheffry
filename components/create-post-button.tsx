"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
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

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const createPost = useMutation(api.posts.create)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    const mediaStorageIds: string[] = []
    if (mediaFiles.length > 0) {
      for (const file of mediaFiles) {
        try {
          const uploadUrl = await generateUploadUrl()
          const result = await fetch(uploadUrl, {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          })

          if (!result.ok) throw new Error("Upload failed")

          const { storageId } = await result.json()
          mediaStorageIds.push(storageId)
        } catch (err: any) {
          setError(err.message)
          setIsSubmitting(false)
          return
        }
      }
    }

    await createPost({
      content: content.trim(),
      country: userCountry,
      mediaStorageIds,
    })

    setContent("")
    setMediaFiles([])
    setMediaPreviews([])
    setOpen(false)
    setIsSubmitting(false)
    onPostCreated?.()
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
