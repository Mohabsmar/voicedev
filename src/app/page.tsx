'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
interface Event {
  id: string
  type: string
  content: string | Record<string, unknown>
  metadata: Record<string, unknown> | null
  timestamp: string
  duration: number
  order: number
}

interface ToolCall {
  id: string
  name: string
  input: Record<string, unknown>
  output: Record<string, unknown> | null
  status: string
  duration: number
  tokensUsed: number
  createdAt: string
  completedAt: string | null
}

interface Memory {
  id: string
  key: string
  value: string
  type: string
  scope: string
  updatedAt: string
}

interface Cost {
  id: string
  provider: string
  model: string
  inputTokens: number
  outputTokens: number
  cost: number
  currency: string
  createdAt: string
}

interface Error {
  id: string
  type: string
  message: string
  stack: string | null
  context: string | null
  resolved: boolean
  createdAt: string
}

interface Session {
  id: string
  name: string | null
  status: string
  events: Event[]
  toolCalls: ToolCall[]
  memories: Memory[]
  costs: Cost[]
  errors: Error[]
  createdAt: string
  updatedAt: string
}

// ============================================
// ICONS (inline SVG for speed)
// ============================================
const Icons = {
  Timeline: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Memory: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Cost: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Bug: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  Replay: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Tools: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Copy: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  Play: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  ),
  Pause: () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Send: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Export: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Share: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Database: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  Globe: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  FileCode: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Cpu: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Log: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

function formatCost(cost: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(cost)
}

function formatTokens(tokens: number) {
  if (tokens < 1000) return tokens.toString()
  if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`
  return `${(tokens / 1000000).toFixed(2)}M`
}

function getEventColor(type: string) {
  const colors: Record<string, string> = {
    prompt: 'bg-blue-500',
    thinking: 'bg-yellow-500',
    tool_call: 'bg-purple-500',
    tool_result: 'bg-green-500',
    response: 'bg-emerald-500',
    error: 'bg-red-500',
    memory_read: 'bg-cyan-500',
    memory_write: 'bg-indigo-500',
    decision: 'bg-orange-500',
  }
  return colors[type] || 'bg-gray-500'
}

function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    pending: 'text-yellow-400',
    running: 'text-blue-400',
    success: 'text-green-400',
    error: 'text-red-400',
    timeout: 'text-orange-400',
    cancelled: 'text-gray-400',
  }
  return colors[status] || 'text-gray-400'
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function VoiceDevPro() {
  // Mode: simple or advanced
  const [mode, setMode] = useState<'simple' | 'advanced'>('simple')
  
  // State
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [activeTab, setActiveTab] = useState('timeline')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('openai')
  const [selectedModel, setSelectedModel] = useState('gpt-5.4')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown' | 'csv'>('json')
  const [replaySpeed, setReplaySpeed] = useState(1)
  const [isReplaying, setIsReplaying] = useState(false)
  const [replayIndex, setReplayIndex] = useState(0)
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string; type: string }>>([])
  
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Provider/Model options - LATEST MODELS (March 2026)
  const providers = [
    { id: 'openai', name: 'OpenAI', models: ['gpt-5.4', 'gpt-5.4-mini', 'gpt-5.3-codex', 'o4', 'o4-mini', 'o3'] },
    { id: 'anthropic', name: 'Anthropic', models: ['claude-sonnet-4.6', 'claude-opus-4.6', 'claude-opus-4.5', 'claude-4-sonnet', 'claude-4-haiku'] },
    { id: 'google', name: 'Google AI', models: ['gemini-3.1-pro', 'gemini-3-deep-think', 'gemini-3-pro', 'gemini-2.5-pro', 'gemma-3-27b'] },
    { id: 'zai', name: 'Z.ai', models: ['z-3-ultra', 'z-3-pro', 'z-3-mini', 'z-2-ultra', 'z-2-pro'] },
    { id: 'deepseek', name: 'DeepSeek', models: ['deepseek-v3.2-exp', 'deepseek-v3.1', 'deepseek-r1-0528', 'deepseek-coder-v2'] },
    { id: 'xai', name: 'xAI (Grok)', models: ['grok-4.20-beta', 'grok-4.1-fast', 'grok-4.1', 'grok-4-vision'] },
    { id: 'moonshot', name: 'Moonshot AI', models: ['kimi-k2.5', 'kimi-k2-thinking', 'kimi-k2', 'moonshot-v1-128k'] },
    { id: 'minimax', name: 'MiniMax', models: ['minimax-m2.7', 'minimax-m2.5', 'minimax-m2'] },
    { id: 'mistral', name: 'Mistral AI', models: ['mistral-small-4', 'mistral-large-3', 'magistral-medium', 'codestral-latest'] },
    { id: 'qwen', name: 'Alibaba Qwen', models: ['qwen-3.5', 'qwen-3.5-small-series', 'qwen-3-next', 'qwen-vl-max', 'qwen-long'] },
    { id: 'glm', name: 'GLM (Zhipu AI)', models: ['glm-5', 'glm-4.7', 'glm-4.7-chat', 'glm-4.7-thinking', 'glm-4.6', 'glm-4.6-vision'] },
    { id: 'groq', name: 'Groq', models: ['llama-4-maverick', 'llama-4-scout', 'llama-3.3-70b', 'mixtral-8x7b'] },
    { id: 'cohere', name: 'Cohere', models: ['command-r3', 'command-r-plus', 'command-r'] },
  ]
  
  const currentProvider = providers.find(p => p.id === selectedProvider)
  
  // Fetch sessions
  useEffect(() => {
    fetchSessions()
  }, [])
  
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
    } catch (e) {
      console.error('Failed to fetch sessions:', e)
    }
  }
  
  // Create new session
  const createSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: `Session ${sessions.length + 1}` }),
      })
      const data = await res.json()
      setSessions([data.session, ...sessions])
      setCurrentSession(data.session)
      setActiveTab('timeline')
      addNotification('New session created', 'success')
    } catch (e) {
      console.error('Failed to create session:', e)
      addNotification('Failed to create session', 'error')
    }
  }
  
  // Select session
  const selectSession = async (id: string) => {
    try {
      const res = await fetch(`/api/sessions/${id}`)
      const data = await res.json()
      setCurrentSession(data.session)
      setActiveTab('timeline')
    } catch (e) {
      console.error('Failed to fetch session:', e)
    }
  }
  
  // Delete session
  const deleteSession = async (id: string) => {
    try {
      await fetch(`/api/sessions/${id}`, { method: 'DELETE' })
      setSessions(sessions.filter(s => s.id !== id))
      if (currentSession?.id === id) {
        setCurrentSession(null)
      }
      addNotification('Session deleted', 'success')
    } catch (e) {
      console.error('Failed to delete session:', e)
    }
  }
  
  // Send message
  const sendMessage = async () => {
    if (!input.trim() || !currentSession) return
    setIsLoading(true)
    
    const userMessage = input.trim()
    setInput('')
    
    try {
      // Add user event
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          type: 'prompt',
          content: { message: userMessage },
          order: currentSession.events.length,
        }),
      })
      
      // Call LLM
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: userMessage }],
          model: selectedModel,
          sessionId: currentSession.id,
        }),
      })
      
      const data = await res.json()
      
      // Add response event
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: currentSession.id,
          type: 'response',
          content: { message: data.response, model: data.model },
          order: currentSession.events.length + 1,
          duration: data.usage?.total_tokens || 0,
        }),
      })
      
      // Add cost
      if (data.usage) {
        await fetch('/api/costs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: currentSession.id,
            provider: selectedProvider,
            model: selectedModel,
            inputTokens: data.usage.prompt_tokens,
            outputTokens: data.usage.completion_tokens,
            cost: calculateCost(data.usage.prompt_tokens, data.usage.completion_tokens),
          }),
        })
      }
      
      // Refresh session
      await selectSession(currentSession.id)
      addNotification('Response received', 'success')
    } catch (e) {
      console.error('Chat error:', e)
      addNotification('Failed to get response', 'error')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Calculate cost
  const calculateCost = (input: number, output: number) => {
    const rates: Record<string, { input: number; output: number }> = {
      'gpt-4o': { input: 2.5, output: 10 },
      'gpt-4o-mini': { input: 0.15, output: 0.6 },
      'claude-3.5-sonnet': { input: 3, output: 15 },
      'gemini-2.0-flash': { input: 0.1, output: 0.4 },
      'deepseek-chat': { input: 0.14, output: 0.28 },
    }
    const rate = rates[selectedModel] || { input: 1, output: 3 }
    return (input * rate.input + output * rate.output) / 1000000
  }
  
  // Export session
  const exportSession = async (format: 'json' | 'markdown' | 'csv') => {
    if (!currentSession) return
    
    let content = ''
    let filename = `session-${currentSession.id}.${format}`
    
    if (format === 'json') {
      content = JSON.stringify(currentSession, null, 2)
    } else if (format === 'markdown') {
      content = `# ${currentSession.name || 'Session'}\n\n`
      content += `**Created:** ${new Date(currentSession.createdAt).toLocaleString()}\n\n`
      content += `## Events\n\n`
      currentSession.events.forEach((e, i) => {
        content += `### ${i + 1}. ${e.type}\n`
        content += `\`\`\`json\n${JSON.stringify(e.content, null, 2)}\n\`\`\`\n\n`
      })
    } else {
      content = 'type,content,timestamp,duration\n'
      currentSession.events.forEach(e => {
        content += `${e.type},"${JSON.stringify(e.content).replace(/"/g, '""')}",${e.timestamp},${e.duration}\n`
      })
    }
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    
    addNotification(`Exported as ${format.toUpperCase()}`, 'success')
  }
  
  // Replay session
  const startReplay = () => {
    if (!currentSession?.events.length) return
    setIsReplaying(true)
    setReplayIndex(0)
  }
  
  useEffect(() => {
    if (!isReplaying || !currentSession) return
    
    const timer = setInterval(() => {
      setReplayIndex(prev => {
        if (prev >= currentSession.events.length - 1) {
          setIsReplaying(false)
          return prev
        }
        return prev + 1
      })
    }, 1000 / replaySpeed)
    
    return () => clearInterval(timer)
  }, [isReplaying, currentSession, replaySpeed])
  
  // Add notification
  const addNotification = (message: string, type: string) => {
    const id = crypto.randomUUID()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }
  
  // Calculate totals
  const totalCost = currentSession?.costs.reduce((sum, c) => sum + c.cost, 0) || 0
  const totalTokens = currentSession?.costs.reduce((sum, c) => sum + c.inputTokens + c.outputTokens, 0) || 0
  
  // Filter events
  const filteredEvents = currentSession?.events.filter(e => {
    if (!searchQuery) return true
    const content = typeof e.content === 'string' ? e.content : JSON.stringify(e.content)
    return content.toLowerCase().includes(searchQuery.toLowerCase()) || e.type.toLowerCase().includes(searchQuery.toLowerCase())
  }) || []
  
  // Tool calls for display
  const toolCalls = currentSession?.toolCalls || []
  
  // Memory items
  const memories = currentSession?.memories || []
  
  // Errors
  const errors = currentSession?.errors || []

  // Simple mode tabs
  const simpleTabs = [
    { id: 'timeline', icon: Icons.Timeline, label: 'Timeline' },
    { id: 'tools', icon: Icons.Tools, label: 'Tool Calls' },
    { id: 'logs', icon: Icons.Log, label: 'Logs' },
  ]
  
  // Advanced mode tabs
  const advancedTabs = [
    { id: 'timeline', icon: Icons.Timeline, label: 'Timeline' },
    { id: 'tools', icon: Icons.Tools, label: 'Tools' },
    { id: 'memory', icon: Icons.Memory, label: 'Memory' },
    { id: 'costs', icon: Icons.Cost, label: 'Costs' },
    { id: 'errors', icon: Icons.Bug, label: 'Errors' },
    { id: 'replay', icon: Icons.Replay, label: 'Replay' },
  ]

  return (
    <div className="h-screen flex bg-zinc-950 text-zinc-100">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(n => (
          <div
            key={n.id}
            className={cn(
              'px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right',
              n.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            )}
          >
            {n.message}
          </div>
        ))}
      </div>
      
      {/* Sidebar - Only in Advanced Mode */}
      {mode === 'advanced' && (
        <div className={cn(
          'bg-zinc-900 border-r border-zinc-800 flex flex-col transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-16'
        )}>
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            {sidebarOpen && <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">VoiceDev Pro</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg"
            >
              <Icons.Menu />
            </button>
          </div>
          
          {/* New Session Button */}
          <div className="p-3">
            <button
              onClick={createSession}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg transition-all shadow-lg shadow-violet-500/20"
            >
              <Icons.Plus />
              {sidebarOpen && <span>New Session</span>}
            </button>
          </div>
          
          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sidebarOpen && <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Sessions</div>}
            {sessions.map(session => (
              <div
                key={session.id}
                className={cn(
                  'group p-2 rounded-lg cursor-pointer transition-colors flex items-center justify-between',
                  currentSession?.id === session.id ? 'bg-violet-600/20 border border-violet-500/30' : 'hover:bg-zinc-800'
                )}
                onClick={() => selectSession(session.id)}
              >
                {sidebarOpen ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{session.name || 'Untitled'}</div>
                      <div className="text-xs text-zinc-500">
                        {session.events?.length || 0} events • {session.toolCalls?.length || 0} tools
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded"
                    >
                      <Icons.Trash />
                    </button>
                  </>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                )}
              </div>
            ))}
          </div>
          
          {/* Provider/Model Selector - Advanced Only */}
          {sidebarOpen && (
            <div className="p-3 border-t border-zinc-800 space-y-2">
              <div className="text-xs text-zinc-500 uppercase tracking-wider">Provider</div>
              <select
                value={selectedProvider}
                onChange={(e) => { setSelectedProvider(e.target.value); setSelectedModel(providers.find(p => p.id === e.target.value)?.models[0] || ''); }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {providers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {currentProvider?.models.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <div className="flex items-center bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setMode('simple')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  mode === 'simple' 
                    ? 'bg-violet-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Icons.Sparkles />
                  Simple
                </span>
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={cn(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-all',
                  mode === 'advanced' 
                    ? 'bg-violet-600 text-white shadow-lg' 
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Icons.Settings />
                  Advanced
                </span>
              </button>
            </div>
            
            {mode === 'simple' && (
              <button
                onClick={createSession}
                className="flex items-center gap-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-sm transition-colors"
              >
                <Icons.Plus />
                <span>New</span>
              </button>
            )}
            
            <h2 className="font-semibold">
              {currentSession?.name || 'No Session Selected'}
            </h2>
            {currentSession && mode === 'advanced' && (
              <span className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                currentSession.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700'
              )}>
                {currentSession.status}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Stats - Only in Advanced Mode */}
            {mode === 'advanced' && (
              <div className="flex items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-1">
                  <Icons.Cost />
                  <span>{formatCost(totalCost)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icons.Cpu />
                  <span>{formatTokens(totalTokens)} tokens</span>
                </div>
              </div>
            )}
            
            {/* Actions - Only in Advanced Mode */}
            {mode === 'advanced' && (
              <>
                <button onClick={() => setActiveTab('settings')} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <Icons.Settings />
                </button>
                <button onClick={() => exportSession(exportFormat)} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <Icons.Export />
                </button>
                <button onClick={startReplay} className="p-2 hover:bg-zinc-800 rounded-lg">
                  <Icons.Replay />
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Tab Bar */}
        <div className="h-10 border-b border-zinc-800 flex items-center gap-1 px-4 bg-zinc-900/30">
          {(mode === 'simple' ? simpleTabs : advancedTabs).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all',
                activeTab === tab.id 
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' 
                  : 'hover:bg-zinc-800 text-zinc-400'
              )}
            >
              <tab.icon />
              {tab.label}
              {tab.id === 'errors' && errors.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 rounded-full">{errors.length}</span>
              )}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!currentSession ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🎤</div>
                <p className="text-lg font-medium text-zinc-300">VoiceDev</p>
                <p className="text-sm mt-2">Click "New" to create an AI agent session</p>
              </div>
            </div>
          ) : (
            <>
              {/* Timeline Tab */}
              {activeTab === 'timeline' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {/* Search */}
                  <div className="sticky top-0 bg-zinc-950/90 backdrop-blur py-2 flex items-center gap-2 z-10">
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                        <Icons.Search />
                      </div>
                      <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                    <button className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors">
                      <Icons.Filter />
                    </button>
                  </div>
                  
                  {/* Events Timeline */}
                  {filteredEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={cn(
                        'relative pl-8 pb-4',
                        isReplaying && index > replayIndex && 'opacity-30'
                      )}
                    >
                      {/* Timeline line */}
                      {index < filteredEvents.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                      )}
                      
                      {/* Event node */}
                      <div className={cn(
                        'absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg',
                        getEventColor(event.type)
                      )}>
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                      
                      {/* Event content */}
                      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium capitalize text-zinc-200">{event.type.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            {event.duration > 0 && <span className="bg-zinc-800 px-2 py-0.5 rounded">{formatDuration(event.duration)}</span>}
                            <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <pre className="text-sm text-zinc-300 whitespace-pre-wrap overflow-x-auto font-mono">
                          {typeof event.content === 'string' ? event.content : JSON.stringify(event.content, null, 2)}
                        </pre>
                        {event.metadata && (
                          <div className="mt-2 pt-2 border-t border-zinc-800 text-xs text-zinc-500">
                            {JSON.stringify(event.metadata)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {filteredEvents.length === 0 && (
                    <div className="text-center text-zinc-500 py-8">
                      <div className="text-2xl mb-2">📭</div>
                      No events yet. Send a message to get started.
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
              )}
              
              {/* Tools Tab */}
              {activeTab === 'tools' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-4">
                    {toolCalls.map(tool => (
                      <div key={tool.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-800/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 rounded-lg">
                              <Icons.Terminal />
                            </div>
                            <div>
                              <div className="font-semibold text-lg">{tool.name}</div>
                              <div className={cn('text-sm', getStatusColor(tool.status))}>
                                {tool.status} • {formatDuration(tool.duration)}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-zinc-500 bg-zinc-800 px-2 py-1 rounded">
                            {tool.tokensUsed > 0 && `${formatTokens(tool.tokensUsed)} tokens`}
                          </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                          <div>
                            <div className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Input</div>
                            <pre className="text-sm bg-zinc-800/50 p-3 rounded-lg overflow-x-auto font-mono border border-zinc-700/50">
                              {JSON.stringify(tool.input, null, 2)}
                            </pre>
                          </div>
                          {tool.output && (
                            <div>
                              <div className="text-xs text-zinc-500 mb-1.5 font-medium uppercase tracking-wider">Output</div>
                              <pre className="text-sm bg-zinc-800/50 p-3 rounded-lg overflow-x-auto max-h-48 font-mono border border-zinc-700/50">
                                {JSON.stringify(tool.output, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {toolCalls.length === 0 && (
                      <div className="text-center text-zinc-500 py-12">
                        <div className="text-4xl mb-3">🔧</div>
                        <p className="text-lg">No tool calls yet</p>
                        <p className="text-sm mt-1">Tools will appear here when the agent uses them</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Logs Tab - Simple Mode Only */}
              {activeTab === 'logs' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                    <div className="bg-zinc-800/50 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                      <Icons.Terminal />
                      <span className="font-medium">Console Output</span>
                    </div>
                    <div className="p-4 font-mono text-sm space-y-1">
                      {filteredEvents.map((event, i) => (
                        <div key={event.id} className="flex gap-3">
                          <span className="text-zinc-500">[{new Date(event.timestamp).toLocaleTimeString()}]</span>
                          <span className={cn(
                            'font-medium',
                            event.type === 'error' ? 'text-red-400' :
                            event.type === 'response' ? 'text-green-400' :
                            event.type === 'tool_call' ? 'text-purple-400' :
                            'text-blue-400'
                          )}>
                            {event.type.toUpperCase()}
                          </span>
                          <span className="text-zinc-300 truncate flex-1">
                            {typeof event.content === 'string' 
                              ? event.content.substring(0, 100) 
                              : JSON.stringify(event.content).substring(0, 100)}
                            ...
                          </span>
                        </div>
                      ))}
                      {filteredEvents.length === 0 && (
                        <div className="text-zinc-500 text-center py-4">No logs yet</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Memory Tab - Advanced Only */}
              {mode === 'advanced' && activeTab === 'memory' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-2">
                    {memories.map(memory => (
                      <div key={memory.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-start justify-between hover:border-zinc-700 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-violet-400">{memory.key}</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full">{memory.type}</span>
                            <span className="text-xs px-2 py-0.5 bg-zinc-800 rounded-full">{memory.scope}</span>
                          </div>
                          <pre className="text-sm text-zinc-300 whitespace-pre-wrap truncate font-mono">
                            {memory.value}
                          </pre>
                        </div>
                      </div>
                    ))}
                    
                    {memories.length === 0 && (
                      <div className="text-center text-zinc-500 py-12">
                        <div className="text-4xl mb-3">🧠</div>
                        <p className="text-lg">No memories stored</p>
                        <p className="text-sm mt-1">Agent memory will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Costs Tab - Advanced Only */}
              {mode === 'advanced' && activeTab === 'costs' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-4">
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-green-400">{formatCost(totalCost)}</div>
                        <div className="text-sm text-zinc-500 mt-1">Total Cost</div>
                      </div>
                      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-blue-400">{formatTokens(totalTokens)}</div>
                        <div className="text-sm text-zinc-500 mt-1">Total Tokens</div>
                      </div>
                      <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-5 text-center">
                        <div className="text-3xl font-bold text-purple-400">{currentSession?.events?.length || 0}</div>
                        <div className="text-sm text-zinc-500 mt-1">Total Events</div>
                      </div>
                    </div>
                    
                    {/* Cost Log */}
                    {currentSession?.costs.map(cost => (
                      <div key={cost.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center justify-between hover:border-zinc-700 transition-colors">
                        <div>
                          <div className="font-semibold">{cost.provider} / {cost.model}</div>
                          <div className="text-sm text-zinc-500">
                            {formatTokens(cost.inputTokens)} in • {formatTokens(cost.outputTokens)} out
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-400 text-lg">{formatCost(cost.cost)}</div>
                          <div className="text-xs text-zinc-500">{new Date(cost.createdAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))}
                    
                    {(!currentSession?.costs || currentSession.costs.length === 0) && (
                      <div className="text-center text-zinc-500 py-12">
                        <div className="text-4xl mb-3">💰</div>
                        <p className="text-lg">No costs recorded yet</p>
                        <p className="text-sm mt-1">Costs will appear as you use the agent</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Errors Tab - Advanced Only */}
              {mode === 'advanced' && activeTab === 'errors' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid gap-3">
                    {errors.map(error => (
                      <div key={error.id} className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-red-400">{error.type}</span>
                          <div className="flex items-center gap-2">
                            {error.resolved ? (
                              <span className="text-xs px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full">Resolved</span>
                            ) : (
                              <span className="text-xs px-2.5 py-1 bg-red-500/20 text-red-400 rounded-full">Unresolved</span>
                            )}
                          </div>
                        </div>
                        <p className="text-sm mb-3">{error.message}</p>
                        {error.stack && (
                          <pre className="text-xs bg-zinc-900 p-3 rounded-lg overflow-x-auto text-zinc-400 font-mono">
                            {error.stack}
                          </pre>
                        )}
                      </div>
                    ))}
                    
                    {errors.length === 0 && (
                      <div className="text-center text-zinc-500 py-12">
                        <div className="text-green-400 text-4xl mb-3">✓</div>
                        <p className="text-lg text-green-400">No errors</p>
                        <p className="text-sm mt-1">All operations completed successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Replay Tab - Advanced Only */}
              {mode === 'advanced' && activeTab === 'replay' && (
                <div className="flex-1 flex flex-col p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => setIsReplaying(!isReplaying)}
                      className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors"
                    >
                      {isReplaying ? <Icons.Pause /> : <Icons.Play />}
                      {isReplaying ? 'Pause' : 'Play'}
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-zinc-400">Speed:</span>
                      {[0.5, 1, 2, 4].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setReplaySpeed(speed)}
                          className={cn(
                            'px-2.5 py-1 rounded-lg text-sm transition-colors',
                            replaySpeed === speed ? 'bg-violet-600 text-white' : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400'
                          )}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex-1">
                      <input
                        type="range"
                        min={0}
                        max={Math.max(0, (currentSession?.events?.length || 1) - 1)}
                        value={replayIndex}
                        onChange={(e) => setReplayIndex(parseInt(e.target.value))}
                        className="w-full accent-violet-500"
                      />
                    </div>
                    
                    <span className="text-sm text-zinc-400 bg-zinc-800 px-3 py-1 rounded-lg">
                      {replayIndex + 1} / {currentSession?.events?.length || 0}
                    </span>
                  </div>
                  
                  {/* Current Event Display */}
                  {currentSession?.events[replayIndex] && (
                    <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={cn(
                          'w-4 h-4 rounded-full shadow-lg',
                          getEventColor(currentSession.events[replayIndex].type)
                        )} />
                        <span className="font-semibold text-lg capitalize">
                          {currentSession.events[replayIndex].type.replace('_', ' ')}
                        </span>
                      </div>
                      <pre className="text-sm whitespace-pre-wrap font-mono text-zinc-300">
                        {typeof currentSession.events[replayIndex].content === 'string'
                          ? currentSession.events[replayIndex].content
                          : JSON.stringify(currentSession.events[replayIndex].content, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
              
              {/* Input Area */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Send a message to the agent..."
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                    disabled={isLoading || !currentSession}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !currentSession}
                    className="px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-violet-500/20 disabled:shadow-none"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Icons.Send />
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
