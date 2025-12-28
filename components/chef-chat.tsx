"use client"

import React from "react"
import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { createClient } from "@/lib/supabase/client"
import type { ChefChat as ChefChatType, ChefMessage } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { ChatSidebar } from "@/components/chat-sidebar"

interface ChefChatProps {
  userId: string
  userCountry: string
  initialChats: ChefChatType[]
  showSidebar: boolean
  setShowSidebar: (show: boolean) => void
  onChatCreated?: () => void
  onChatDeleted?: () => void
}

export function ChefChat({
  userId,
  userCountry,
  initialChats,
  showSidebar,
  setShowSidebar,
  onChatCreated,
  onChatDeleted,
}: ChefChatProps) {
  const [chats, setChats] = useState<ChefChatType[]>(initialChats)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [isNewChatStarted, setIsNewChatStarted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  
  // Fix currentChatId race condition
  const chatIdRef = useRef<string | null>(null)

  // Sync initialChats properly
  useEffect(() => {
    setChats(initialChats)
  }, [initialChats])

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chef" }),
    body: {
      userId,
      userCountry,
      chatId: currentChatId,
    },
    onFinish: async (message) => {
      console.log("Chat finished", message)

      // Use ref instead of state
      const chatId = chatIdRef.current
      if (!chatId || !message) {
        console.log("No chatId or message, skipping save", { chatId, message })
        return
      }

      // Extract text content properly from message
      let assistantText = ""
      if (typeof message.content === 'string') {
        assistantText = message.content
      } else if (Array.isArray(message.parts)) {
        assistantText = message.parts
          .filter(part => part.type === 'text')
          .map(part => part.text)
          .join('')
      } else if (message.text) {
        assistantText = message.text
      }

      console.log("Saving assistant message:", { chatId, assistantTextLength: assistantText.length })

      // Save assistant message to database when streaming finishes
      const supabase = createClient()
      try {
        const { data, error } = await supabase.from("chef_messages").insert({
          chat_id: chatId,
          role: "assistant",
          content: assistantText,
        }).select()

        if (error) {
          console.error("Error saving assistant message:", error)
        } else {
          console.log("Assistant message saved to database:", data)
        }

        // Update the chat's updated_at timestamp
        await supabase
          .from("chef_chats")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", chatId)

      } catch (error) {
        console.error("Error saving assistant message:", error)
      }
    },
    onError: (error) => {
      console.error("Chat stream error:", error)
    },
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatMessages = async (chatId: string) => {
    console.log("Loading chat messages for:", chatId)
    
    const supabase = createClient()
    const { data: chatMessages, error } = await supabase
      .from("chef_messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error loading chat messages:", error)
      return
    }

    console.log("Loaded chat messages:", chatMessages)

    if (chatMessages) {    
      // FIX: Format messages properly for the UI
      const formattedMessages = chatMessages.map((msg: ChefMessage) => {
        console.log("Formatting message:", msg)
        return {
          id: msg.id,
          role: msg.role as "user" | "assistant",
          content: msg.content, // Add content field for debugging
          parts: [{ type: "text" as const, text: msg.content }],
        }
      })
      
      console.log("Formatted messages for UI:", formattedMessages)
      setMessages(formattedMessages)
    } else {
      console.log("No chat messages found")
      setMessages([])
    }
    
    // Update ref and state
    chatIdRef.current = chatId
    setCurrentChatId(chatId)
    setIsNewChatStarted(false)
  }

  const startNewChat = () => {
    // Update ref and state
    chatIdRef.current = null
    setCurrentChatId(null)
    setMessages([])
    setInputValue("")
    setIsNewChatStarted(true)
  }

  const deleteChat = async (chatId: string) => {
    const supabase = createClient()
    await supabase.from("chef_chats").delete().eq("id", chatId)
    
    if (currentChatId === chatId) {
      chatIdRef.current = null
      setCurrentChatId(null)
      setMessages([])
      setIsNewChatStarted(false)
    }
    
    // Notify parent to refresh chats
    onChatDeleted?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status === "streaming") return

    let chatId = currentChatId    
    let chatWasJustCreated = false

    // Create a new chat if none exists    
    if (!chatId) {    
      const supabase = createClient()    
      const { data: newChat } = await supabase    
        .from("chef_chats")    
        .insert({    
          user_id: userId,    
          title: inputValue.substring(0, 50) + (inputValue.length > 50 ? "..." : ""),    
        })    
        .select()    
        .single()    

      if (newChat) {    
        chatId = newChat.id
        chatWasJustCreated = true
        
        // Update ref and state
        chatIdRef.current = chatId
        setCurrentChatId(chatId)
        setIsNewChatStarted(false)
      } else {
        console.error("Failed to create new chat")
        return
      }
    }    

    // Save user message to database    
    if (chatId) {    
      const supabase = createClient()    
      try {
        // Block UI if DB insert fails
        const { error } = await supabase.from("chef_messages").insert({    
          chat_id: chatId,    
          role: "user",    
          content: inputValue,    
        })

        if (error) {
          console.error("Error saving user message:", error)
          return // STOP HERE if insert fails
        }
      } catch (error) {
        console.error("Error saving user message:", error)
        return // STOP HERE if insert fails
      }
    } else {
      console.error("No chatId available for saving message")
      return
    }

    // Only send message to AI if DB insert succeeded
    const messageToSend = inputValue
    setInputValue("")
    
    // Always pass chatId in sendMessage options
    console.log("Sending message with chatId:", chatId)
    sendMessage(
      { text: messageToSend }, 
      { options: { body: { userId, userCountry, chatId } } }
    )
    
    // Notify parent to refresh chats if we created a new one
    if (chatWasJustCreated) {
      onChatCreated?.()
    }
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Chat Sidebar */}
      <ChatSidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={loadChatMessages}
        onNewChat={startNewChat}
        onDeleteChat={deleteChat}
        showSidebar={showSidebar}
        onCloseSidebar={() => setShowSidebar(false)}
      />

      {/* Main Chat Area */}    
      <div className="flex-1 flex flex-col overflow-hidden relative h-full">    
        {currentChatId !== null || messages.length > 0 || isNewChatStarted ? (    
          <>  
            {/* Messages container - takes all available space */}  
            <div   
              ref={scrollAreaRef}  
              className="flex-1 overflow-y-auto p-4 pb-32"
            >    
              <div className="max-w-3xl mx-auto flex flex-col gap-4">   
                {messages.map((message) => {    
                  console.log("Rendering message:", message)
                  return (
                    <div    
                      key={message.id}    
                      className={cn(    
                        "flex gap-3 max-w-[85%]",    
                        message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",    
                      )}    
                    >    
                      <div    
                        className={cn(    
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",    
                          message.role === "user"    
                            ? "bg-primary text-primary-foreground"    
                            : "bg-secondary text-secondary-foreground",    
                        )}    
                      >    
                        {message.role === "user" ? (    
                          <Icons.user className="h-4 w-4" />    
                        ) : (    
                          <Icons.chef className="h-4 w-4" />    
                        )}    
                      </div>    
                      <div    
                        className={cn(    
                          "rounded-lg px-4 py-3 text-sm",    
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground",    
                        )}    
                      >    
                        {/* FIX: Handle different message formats */}
                        {message.content ? (
                          <div className="whitespace-pre-wrap">{message.content}</div>
                        ) : message.parts ? (
                          message.parts.map((part, index) => {    
                            if (part.type === "text") {    
                              return (    
                                <div key={index} className="whitespace-pre-wrap">    
                                  {part.text}    
                                </div>    
                              )    
                            }    
                            return null    
                          })
                        ) : (
                          <div className="whitespace-pre-wrap">{message.text}</div>
                        )}
                      </div>    
                    </div>    
                  )
                })}    
                {status === "streaming" && (    
                  <div className="flex gap-3 mr-auto">    
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">    
                      <Icons.chef className="h-4 w-4" />    
                    </div>    
                    <div className="rounded-lg px-4 py-3 bg-muted">    
                      <Icons.spinner className="h-4 w-4 animate-spin" />    
                    </div>    
                  </div>    
                )}    
                <div ref={messagesEndRef} />    
              </div>    
            </div>    

            {/* Fixed input field at the bottom of the screen */}  
            <div className="fixed bottom-15 border-t bg-background z-10 p-4"  
                 style={{  
                   left: showSidebar ? '320px' : '0',  
                   right: '0',  
                   transition: 'left 0.3s ease',  
                   boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)'  
                 }}>  
              <div className="max-w-3xl mx-auto">  
                <form onSubmit={handleSubmit} className="flex gap-2">    
                  <Textarea    
                    placeholder="Ask Cheffry anything about cooking..."    
                    value={inputValue}    
                    onChange={(e) => setInputValue(e.target.value)}    
                    onKeyDown={(e) => {    
                      if (e.key === "Enter" && !e.shiftKey) {    
                        e.preventDefault()    
                        handleSubmit(e)    
                      }    
                    }}    
                    className="min-h-[60px] resize-none flex-1"    
                    disabled={status === "streaming"}    
                  />    
                  <Button   
                    type="submit"   
                    size="icon"   
                    className="h-[60px] w-[60px]"  
                    disabled={status === "streaming" || !inputValue.trim()}  
                  >    
                    {status === "streaming" ? (    
                      <Icons.spinner className="h-4 w-4 animate-spin" />    
                    ) : (    
                      <Icons.send className="h-4 w-4" />    
                    )}    
                  </Button>    
                </form>    
              </div>  
            </div>    
          </>  
        ) : (    
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">    
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">    
              <Icons.chef className="h-8 w-8 text-primary" />    
            </div>    
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Cheffry</h2>    
            <p className="text-muted-foreground max-w-md mb-6">    
              Your smart AI chef assistant. Ask me anything about cooking, recipes, ingredients, or get personalized    
              meal suggestions based on what you have.    
            </p>    
            <Button onClick={startNewChat}>    
              <Icons.plus className="mr-2 h-4 w-4" />    
              Start a new chat    
            </Button>    
          </div>    
        )}    
      </div>    
    </div>
  )
}