import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"
import { rateLimit, getClientIP } from "@/lib/rate-limit"
import { NextResponse } from "next/server"

export const maxDuration = 30

// Free tier optimization: Limit AI requests to control costs
const AI_RATE_LIMIT = {
  maxRequests: 20, // 20 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
}

export async function POST(req: Request) {
  try {
    // Rate limiting to control AI costs
    const clientIP = getClientIP(req)
    const rateLimitResult = rateLimit(`chat:${clientIP}`, AI_RATE_LIMIT)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "You have reached your AI chat limit. Please try again later.",
          resetIn: Math.ceil(rateLimitResult.resetIn / 1000),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetIn / 1000)),
          },
        }
      )
    }

    const { messages }: { messages: UIMessage[] } = await req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request", message: "Messages array is required" },
        { status: 400 }
      )
    }

    // Limit message history to control token usage (cost optimization)
    const limitedMessages = messages.slice(-10)

    // Convert UIMessages to model messages for AI SDK v5
    const prompt = convertToModelMessages(limitedMessages)

    const result = streamText({
      model: "openai/gpt-4o-mini", // Most cost-effective model via Vercel AI Gateway
      system: `You are NexusAI, an intelligent productivity assistant. You help users with:
- Writing and editing documents
- Brainstorming ideas
- Answering questions
- Analyzing information
- Planning and organizing tasks

Be helpful, concise, and professional. Format your responses with markdown when appropriate.
Keep responses focused and avoid unnecessary verbosity to optimize for efficiency.`,
      messages: prompt,
      maxOutputTokens: 1000, // Limit response length for cost control (v5 uses maxOutputTokens)
      abortSignal: req.signal,
    })

    // AI SDK v5 uses toUIMessageStreamResponse instead of toDataStreamResponse
    return result.toUIMessageStreamResponse({
      onFinish: async ({ isAborted }) => {
        if (isAborted) {
          console.log("[v0] Chat request aborted")
        }
      },
      consumeSseStream: consumeStream,
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return NextResponse.json(
      { error: "Internal server error", message: "Failed to process chat request" },
      { status: 500 }
    )
  }
}
