"use client"

import { formatDistanceToNow } from "date-fns"
import type { ChefChat } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  chats: ChefChat[]
  currentChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  showSidebar: boolean
  onCloseSidebar: () => void
}

export function ChatSidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  showSidebar,
  onCloseSidebar,
}: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {showSidebar && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onCloseSidebar} />}

      <div
        className={cn(
          "w-64 border-r border-border bg-background flex flex-col",
          "fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 md:relative md:translate-x-0",
          showSidebar ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-3 border-b border-border flex items-center justify-between">
          <span className="font-medium text-sm">Chat History</span>
          <Button variant="ghost" size="icon" onClick={onNewChat} className="h-8 w-8">
            <Icons.plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 flex flex-col gap-1">
            {chats.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No chats yet</p>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={cn(
                    "group flex items-center gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors",
                    currentChatId === chat.id ? "bg-accent text-accent-foreground" : "hover:bg-muted",
                  )}
                  onClick={() => {
                    onSelectChat(chat.id)
                    onCloseSidebar()
                  }}
                >
                  <Icons.comment className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                  >
                    <Icons.trash className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
