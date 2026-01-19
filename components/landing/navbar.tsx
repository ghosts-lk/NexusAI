"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>NexusAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
            Testimonials
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="ghost" className="bg-transparent">
            <Link href="/auth/login">Log in</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/sign-up">Start Free Trial</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-4">
            <Link 
              href="#features" 
              className="block text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="#pricing" 
              className="block text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="#testimonials" 
              className="block text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
            >
              Testimonials
            </Link>
            <div className="pt-4 space-y-2">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/auth/sign-up">Start Free Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
