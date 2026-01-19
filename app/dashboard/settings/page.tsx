"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, User, Shield } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || "")
        setFullName(user.user_metadata?.full_name || "")
      }
      setIsLoadingProfile(false)
    }
    loadProfile()
  }, [supabase])

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error
      toast({ title: "Profile updated successfully!" })
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
          </div>
          <Button onClick={handleUpdateProfile} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="bg-transparent">
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
