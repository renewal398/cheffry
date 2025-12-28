import { convertToModelMessages, streamText, type UIMessage } from "ai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

const CHEF_SYSTEM_PROMPT = `You are Cheffry, a smart and friendly AI chef assistant.

Your personality:
- Warm, encouraging, and passionate about cooking
- Knowledgeable about cuisines from around the world
- Patient with beginners and helpful with experts

Your guidelines:
- When suggesting recipes, ONLY use the exact ingredients the user mentions they have
- If the user specifies limited ingredients, create meals using ONLY those ingredients
- Respect the user's country and suggest locally-relevant cooking styles when appropriate
- Provide clear, step-by-step instructions
- Include cooking times and serving sizes when relevant
- Offer tips for ingredient substitutions when asked
- Be encouraging and make cooking feel approachable

Format your responses:
- Use clear headings for recipe names
- Number your steps for easy following
- Include estimated cooking and prep times
- Mention any special equipment needed`

export async function POST(req: Request) {
  const {
    messages,
    userId,
    userCountry,
    chatId,
  }: { messages: UIMessage[]; userId: string; userCountry: string; chatId: string } = await req.json()

  const systemPrompt = `${CHEF_SYSTEM_PROMPT}\n\nThe user is from ${userCountry}. Keep their local cuisine and available ingredients in mind when making suggestions.`

  const prompt = convertToModelMessages(messages)

  const result = streamText({
    model: "openai/gpt-4o-mini",
    system: systemPrompt,
    messages: prompt,
    maxOutputTokens: 2000,
    temperature: 0.7,
    abortSignal: req.signal,
    async onFinish({ text }) {
      if (chatId) {
        const supabase = await createClient()
        await supabase.from("chef_messages").insert({
          chat_id: chatId,
          role: "assistant",
          content: text,
        })
        await supabase.from("chef_chats").update({ updated_at: new Date().toISOString() }).eq("id", chatId)
      }
    },
  })

  return result.toUIMessageStreamResponse()
}
