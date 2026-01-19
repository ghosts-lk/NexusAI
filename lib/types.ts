// Database types for type-safe queries

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  subscription_tier: 'free' | 'pro' | 'enterprise'
  stripe_customer_id: string | null
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

export interface Document {
  id: string
  title: string
  content: string | null
  workspace_id: string
  user_id: string
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  due_date: string | null
  workspace_id: string
  user_id: string
  assigned_to: string | null
  created_at: string
  updated_at: string
}

export interface AIChat {
  id: string
  title: string
  messages: ChatMessage[]
  user_id: string
  workspace_id: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Subscription tiers and limits
export const SUBSCRIPTION_LIMITS = {
  free: {
    documents: 50,
    aiChats: 100,
    tasks: 200,
    workspaces: 3,
    storage: 5 * 1024 * 1024 * 1024, // 5GB
    aiRequestsPerHour: 20,
  },
  pro: {
    documents: -1, // unlimited
    aiChats: -1,
    tasks: -1,
    workspaces: -1,
    storage: 100 * 1024 * 1024 * 1024, // 100GB
    aiRequestsPerHour: 100,
  },
  enterprise: {
    documents: -1,
    aiChats: -1,
    tasks: -1,
    workspaces: -1,
    storage: -1, // unlimited
    aiRequestsPerHour: -1,
  },
} as const

export type SubscriptionTier = keyof typeof SUBSCRIPTION_LIMITS
