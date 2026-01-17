import React from "react"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const token = await convexAuthNextjsToken()
  const profile: any = await fetchQuery(api.users.viewer, {}, { token })

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto">
        <div className="container max-w-2xl mx-auto px-4 py-6">
          <SettingsForm profile={profile ?? null} userEmail={profile?.email ?? ""} />
        </div>
      </div>
    </div>
  )
}