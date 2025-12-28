import React from "react"
import { createClient } from "@/lib/supabase/server"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single()

  return (
    <div className="flex flex-col h-screen">
      

      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <SettingsForm profile={profile ?? null} userEmail={user?.email ?? ""} />
        </div>
      </div>
    </div>
  )
}