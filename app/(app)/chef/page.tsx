"use client"

import React, { useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { ChefChat } from "@/components/chef-chat"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export default function ChefPage() {
  const profile = useQuery(api.users.viewer)
  const chats = useQuery(api.chef.listChats) || []
  const [showSidebar, setShowSidebar] = useState(false)

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-[100dvh] max-h-[100dvh] overflow-hidden">
      {/* Fixed Header - Stays in place */}
      <header className="fixed top-0 left-0 right-0 z-50 shrink-0 flex items-center justify-between border-b bg-background px-4 py-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Chef AI</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed right-4 top-3 z-50"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          <Icons.menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Main content with padding to account for fixed header */}  
      <div className="flex-1 overflow-hidden pt-14">
        <ChefChat  
          userId={profile._id}
          userCountry={profile?.country || "Unknown"}  
          showSidebar={showSidebar}  
          setShowSidebar={setShowSidebar}  
          onChatCreated={() => {}}
          onChatDeleted={() => {}}
        />  
      </div>  
    </div>
  )
}
