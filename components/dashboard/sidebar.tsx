"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Sparkles, 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  CheckSquare, 
  Settings,
  LogOut,
  CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import type { User } from "@supabase/supabase-js"

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "AI Chat", icon: MessageSquare },
  { href: "/dashboard/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast.success("Signed out successfully")
    router.push("/")
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-sidebar-border">
        <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="font-bold text-lg text-sidebar-foreground">NexusAI</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sm font-medium text-sidebar-primary">
            {user.email?.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-sidebar-foreground">
              {user.user_metadata?.full_name || "User"}
            </p>
            <p className="text-xs text-sidebar-foreground/60 truncate">{user.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground bg-transparent"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </aside>
  )
}
