import type { Profile } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/icons"

interface ProfileHeaderProps {
  profile: Profile | null
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold text-foreground">{profile?.name || "Unknown"}</h2>
          <div className="flex items-center gap-1 text-muted-foreground mt-1">
            <Icons.globe className="h-4 w-4" />
            <span>{profile?.country || "Unknown"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
