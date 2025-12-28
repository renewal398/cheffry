import React from "react"
import { createClient } from "@/lib/supabase/server"
import { PikADoWizard } from "@/components/pik-a-do-wizard"

export default async function PikADoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user!.id).single()

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
