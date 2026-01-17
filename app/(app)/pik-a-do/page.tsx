import React from "react"
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { PikADoWizard } from "@/components/pik-a-do-wizard"

export default async function PikADoPage() {
  const token = await convexAuthNextjsToken()
  const profile: any = await fetchQuery(api.users.viewer, {}, { token })

  return (
    <div className="flex flex-col h-screen">
      

      <div className="flex-1 overflow-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <PikADoWizard userCountry={profile?.country || "Unknown"} />
        </div>
      </div>
    </div>
  )
}
