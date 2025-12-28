"use client"

import React, { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChefChat } from "@/components/chef-chat"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import type { Profile, ChefChat as ChefChatType } from "@/lib/types"
import type { User } from "@supabase/supabase-js"

export default function ChefPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [chats, setChats] = useState<ChefChatType[]>([])
  const [showSidebar, setShowSidebar] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {  
        const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()  
        setProfile(profileData)  

        const { data: chatsData } = await supabase  
          .from("chef_chats")  
          .select("*")  
          .eq("user_id", user.id)  
          .order("updated_at", { ascending: false })  
        setChats(chatsData || [])  
      }  
    }  
    fetchData()
  }, [])

  // Function to refresh chats from database
  const refreshChats = async () => {
    if (user) {
      const supabase = createClient()
      const { data: chatsData } = await supabase  
        .from("chef_chats")  
        .select("*")  
        .eq("user_id", user.id)  
        .order("updated_at", { ascending: false })  
      setChats(chatsData || [])  
    }
  }

  if (!user) {
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
          userId={user.id}  
          userCountry={profile?.country || "Unknown"}  
          initialChats={chats}  
          showSidebar={showSidebar}  
          setShowSidebar={setShowSidebar}  
          onChatCreated={refreshChats}  // CHANGE: Pass refresh callback
          onChatDeleted={refreshChats}  // CHANGE: Pass refresh callback
        />  
      </div>  
    </div>
  )
}
