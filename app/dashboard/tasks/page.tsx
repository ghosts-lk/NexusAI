"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckSquare, 
  Plus, 
  Circle,
  CheckCircle2,
  Trash2,
  Loader2,
  Calendar
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import useSWR from "swr"

interface Task {
  id: string
  title: string
  status: "todo" | "in_progress" | "done"
  priority: "low" | "medium" | "high"
  due_date: string | null
  created_at: string
}

const priorityColors = {
  low: "text-muted-foreground",
  medium: "text-yellow-500",
  high: "text-red-500"
}

export default function TasksPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium")
  const [newDueDate, setNewDueDate] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [filter, setFilter] = useState<"all" | "todo" | "in_progress" | "done">("all")
  const supabase = createClient()

  const fetcher = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) throw error
    return data as Task[]
  }

  const { data: tasks, mutate, isLoading } = useSWR("tasks", fetcher)

  const filteredTasks = tasks?.filter(task => 
    filter === "all" ? true : task.status === filter
  ) || []

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast({ title: "Please enter a task title", variant: "destructive" })
      return
    }

    setIsCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title: newTitle,
        priority: newPriority,
        due_date: newDueDate || null,
        status: "todo"
      })

      if (error) throw error

      toast({ title: "Task created!" })
      setIsCreateOpen(false)
      setNewTitle("")
      setNewPriority("medium")
      setNewDueDate("")
      mutate()
    } catch {
      toast({ title: "Failed to create task", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done"
    try {
      const { error } = await supabase
        .from("tasks")
        .update({ status: newStatus })
        .eq("id", task.id)
      
      if (error) throw error
      mutate()
    } catch {
      toast({ title: "Failed to update task", variant: "destructive" })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", id)
      if (error) throw error
      toast({ title: "Task deleted" })
      mutate()
    } catch {
      toast({ title: "Failed to delete task", variant: "destructive" })
    }
  }

  const todoCount = tasks?.filter(t => t.status === "todo").length || 0
  const doneCount = tasks?.filter(t => t.status === "done").length || 0

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tasks</h1>
          <p className="text-muted-foreground">
            {todoCount} remaining, {doneCount} completed
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="What needs to be done?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newPriority} onValueChange={(v: "low" | "medium" | "high") => setNewPriority(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "todo", "in_progress", "done"] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className={filter !== f ? "bg-transparent" : ""}
          >
            {f === "all" ? "All" : f === "todo" ? "To Do" : f === "in_progress" ? "In Progress" : "Done"}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first task to get started
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-4 flex items-center gap-4">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className="flex-shrink-0"
                >
                  {task.status === "done" ? (
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.status === "done" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-sm">
                    <span className={priorityColors[task.priority]}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} priority
                    </span>
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 text-muted-foreground hover:text-destructive bg-transparent"
                  onClick={() => handleDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
