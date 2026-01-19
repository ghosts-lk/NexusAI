"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const COOKIE_CONSENT_KEY = "nexusai_cookie_consent"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-card border-t border-border animate-in slide-in-from-bottom-5">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground text-center sm:text-left">
          We use cookies to enhance your experience. By continuing to use NexusAI, you agree to our{" "}
          <Link href="/legal/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDecline}
            className="bg-transparent"
          >
            Decline
          </Button>
          <Button 
            size="sm" 
            onClick={handleAccept}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  )
}
