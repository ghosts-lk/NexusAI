"use client"

import { useSearchParams } from "next/navigation"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Loader2 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import useSWR from "swr"

interface Document {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newContent, setNewContent] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const supabase = createClient()

  const fetcher = async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .order("updated_at", { ascending: false })
    
    if (error) throw error
    return data as Document[]
  }

  const { data: documents, error, mutate, isLoading } = useSWR("documents", fetcher)

  const filteredDocuments = documents?.filter(doc => 
    doc.title.toLowerCase().includes(search.toLowerCase())
  ) || []

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      toast({ title: "Please enter a title", variant: "destructive" })
      return
    }

    setIsCreating(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("documents").insert({
        user_id: user.id,
        title: newTitle,
        content: newContent,
      })

      if (error) throw error

      toast({ title: "Document created!" })
      setIsCreateOpen(false)
      setNewTitle("")
      setNewContent("")
      mutate()
    } catch (err) {
      toast({ title: "Failed to create document", variant: "destructive" })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("documents").delete().eq("id", id)
      if (error) throw error
      toast({ title: "Document deleted" })
      mutate()
    } catch {
      toast({ title: "Failed to delete document", variant: "destructive" })
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Documents</h1>
          <p className="text-muted-foreground">Create and manage your documents</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-5 w-5 mr-2" />
              New Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Document title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Start writing..."
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>
              <Button onClick={handleCreate} className="w-full" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Document"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Documents Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No documents yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first document to get started
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-5 w-5 mr-2" />
            Create Document
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-medium truncate">
                    {doc.title}
                  </CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 bg-transparent">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {doc.content || "No content yet..."}
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  Updated {new Date(doc.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
