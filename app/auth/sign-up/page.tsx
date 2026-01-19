"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        toast.error(error.message)
        return
      }

      setIsSuccess(true)
      toast.success("Check your email to confirm your account!")
    } catch {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground mb-6">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. 
            Click the link to activate your account.
          </p>
          <Button asChild variant="outline" className="bg-transparent">
            <Link href="/auth/login">Back to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <span>NexusAI</span>
        </Link>

        {/* Form Card */}
        <div className="p-8 rounded-xl border border-border bg-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">Start your 14-day free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (min 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Start Free Trial"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up, you agree to our{" "}
            <Link href="#" className="underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="#" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
