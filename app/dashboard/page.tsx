import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText, MessageSquare, CheckSquare, Sparkles, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// Free tier limits
const FREE_LIMITS = {
  documents: 50,
  aiChats: 100,
  tasks: 200,
  storage: 5 * 1024 * 1024 * 1024, // 5GB in bytes
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch counts with caching (use cache directive above)
  const [documentsResult, tasksResult, chatsResult] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase.from("tasks").select("id", { count: "exact", head: true }),
    supabase.from("ai_chats").select("id", { count: "exact", head: true })
  ])

  const documentCount = documentsResult.count || 0
  const taskCount = tasksResult.count || 0
  const chatCount = chatsResult.count || 0

  const stats = [
    { 
      label: "Documents", 
      value: documentCount, 
      limit: FREE_LIMITS.documents,
      icon: FileText, 
      href: "/dashboard/documents",
      color: "text-blue-500"
    },
    { 
      label: "AI Chats", 
      value: chatCount, 
      limit: FREE_LIMITS.aiChats,
      icon: MessageSquare, 
      href: "/dashboard/chat",
      color: "text-emerald-500"
    },
    { 
      label: "Tasks", 
      value: taskCount, 
      limit: FREE_LIMITS.tasks,
      icon: CheckSquare, 
      href: "/dashboard/tasks",
      color: "text-amber-500"
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "there"}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your workspace today.
        </p>
      </div>

      {/* Stats Grid with Usage */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const percentage = Math.min((stat.value / stat.limit) * 100, 100)
          const isNearLimit = percentage > 80
          
          return (
            <Link key={stat.label} href={stat.href}>
              <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <div className="space-y-1">
                    <Progress 
                      value={percentage} 
                      className={`h-1.5 ${isNearLimit ? '[&>div]:bg-amber-500' : ''}`} 
                    />
                    <p className="text-xs text-muted-foreground">
                      {stat.value} / {stat.limit} used
                      {isNearLimit && (
                        <span className="text-amber-500 ml-1">(Near limit)</span>
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Free Tier Banner */}
      <Card className="mb-8 border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">You&apos;re on the Free Plan</p>
                <p className="text-sm text-muted-foreground">
                  Upgrade to Pro for unlimited documents, AI chats, and priority support
                </p>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/dashboard/billing">
                <TrendingUp className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Get started with these common tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/dashboard/chat">
                <MessageSquare className="h-6 w-6 text-emerald-500" />
                <span>Start AI Chat</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/dashboard/documents">
                <FileText className="h-6 w-6 text-blue-500" />
                <span>Create Document</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2 bg-transparent">
              <Link href="/dashboard/tasks">
                <CheckSquare className="h-6 w-6 text-amber-500" />
                <span>Add Task</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
