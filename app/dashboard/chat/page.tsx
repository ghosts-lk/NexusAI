"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Sparkles, Send, Loader2, Bot, User } from "lucide-react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // AI SDK v5: useChat with transport and managed input state
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (status !== "ready") return
    sendMessage({ text: suggestion })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          AI Assistant
        </h1>
        <p className="text-muted-foreground mt-1">
          Chat with your AI assistant to get help with anything.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground">
                I can help you write documents, brainstorm ideas, analyze data, 
                answer questions, and much more.
              </p>
              <div className="mt-6 grid gap-2">
                {[
                  "Help me write a project proposal",
                  "Summarize the key points of this document",
                  "Generate ideas for a marketing campaign"
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="text-left justify-start h-auto py-3 px-4 bg-transparent"
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={status !== "ready"}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : ""}`}
              >
                {message.role === "assistant" && (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <Card className={`p-4 max-w-[80%] ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-card"
                }`}>
                  {/* AI SDK v5: messages use parts array instead of content */}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.parts?.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.text}</span>
                      }
                      return null
                    })}
                  </div>
                </Card>
                {message.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <Card className="p-4 bg-card">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
