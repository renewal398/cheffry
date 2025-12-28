export interface Profile {
  id: string
  name: string
  avatar_url: string | null
  country: string
  created_at: string
}

export interface Post {
  id: string
  user_id: string
  content: string
  media_urls: string[]
  country: string
  created_at: string
  profiles?: Profile
  likes_count?: number
  dislikes_count?: number
  comments_count?: number
  user_interaction?: "like" | "dislike" | null
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  profiles?: Profile
}

export interface Interaction {
  id: string
  user_id: string
  post_id: string
  type: "like" | "dislike"
  created_at: string
}

export interface ChefChat {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export interface ChefMessage {
  id: string
  chat_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}

export interface Country {
  name: string
  code: string
}
