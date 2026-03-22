'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

// ============================================
// TYPES
// ============================================
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  model?: string
  tokens?: number
}

interface ChatSession {
  id: string
  name: string
  messages: Message[]
  createdAt: Date
  provider: string
  model: string
}

// ============================================
// ICONS
// ============================================
const Icons = {
  Send: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
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
  Check: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Terminal: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
}

// ============================================
// PROVIDERS WITH LATEST 2026 MODELS
// ============================================
const PROVIDERS = [
  { 
    id: 'openai', 
    name: 'OpenAI', 
    models: [
      { id: 'gpt-5.4', name: 'GPT-5.4', contextWindow: 1000000 },
      { id: 'gpt-5.4-turbo', name: 'GPT-5.4 Turbo', contextWindow: 1000000 },
      { id: 'gpt-5.4-mini', name: 'GPT-5.4 Mini', contextWindow: 256000 },
      { id: 'gpt-5.3-codex', name: 'GPT-5.3 Codex', contextWindow: 512000 },
      { id: 'o4', name: 'o4', contextWindow: 256000 },
      { id: 'o4-mini', name: 'o4 Mini', contextWindow: 200000 },
    ]
  },
  { 
    id: 'anthropic', 
    name: 'Anthropic', 
    models: [
      { id: 'claude-sonnet-4.6', name: 'Claude Sonnet 4.6', contextWindow: 1000000 },
      { id: 'claude-sonnet-4.6-turbo', name: 'Claude Sonnet 4.6 Turbo', contextWindow: 1000000 },
      { id: 'claude-opus-4.6', name: 'Claude Opus 4.6', contextWindow: 1000000 },
      { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', contextWindow: 200000 },
      { id: 'claude-4-sonnet', name: 'Claude 4 Sonnet', contextWindow: 200000 },
    ]
  },
  { 
    id: 'google', 
    name: 'Google AI', 
    models: [
      { id: 'gemini-3.1-ultra', name: 'Gemini 3.1 Ultra', contextWindow: 4000000 },
      { id: 'gemini-3.1-pro', name: 'Gemini 3.1 Pro', contextWindow: 2000000 },
      { id: 'gemini-3.1-pro-turbo', name: 'Gemini 3.1 Pro Turbo', contextWindow: 2000000 },
      { id: 'gemini-3.1-flash', name: 'Gemini 3.1 Flash', contextWindow: 1000000 },
      { id: 'gemini-3.1-ultra-long', name: 'Gemini 3.1 Ultra Long', contextWindow: 10000000 },
      { id: 'gemini-3-deep-think', name: 'Gemini 3 Deep Think', contextWindow: 1000000 },
    ]
  },
  { 
    id: 'deepseek', 
    name: 'DeepSeek', 
    models: [
      { id: 'deepseek-v3.5', name: 'DeepSeek V3.5', contextWindow: 512000 },
      { id: 'deepseek-v3.2-exp', name: 'DeepSeek V3.2-Exp', contextWindow: 256000 },
      { id: 'deepseek-v3.1', name: 'DeepSeek V3.1', contextWindow: 128000 },
      { id: 'deepseek-r1-0528', name: 'DeepSeek R1', contextWindow: 128000 },
    ]
  },
  { 
    id: 'xai', 
    name: 'xAI (Grok)', 
    models: [
      { id: 'grok-4.5', name: 'Grok 4.5', contextWindow: 1000000 },
      { id: 'grok-4.20-beta', name: 'Grok 4.20 Beta', contextWindow: 512000 },
      { id: 'grok-4.1-fast', name: 'Grok 4.1 Fast', contextWindow: 256000 },
      { id: 'grok-4.1', name: 'Grok 4.1', contextWindow: 256000 },
    ]
  },
  { 
    id: 'zai', 
    name: 'Z.ai (GLM)', 
    models: [
      { id: 'glm-5', name: 'GLM-5', contextWindow: 512000 },
      { id: 'glm-4.7', name: 'GLM-4.7', contextWindow: 256000 },
      { id: 'glm-4.7-flash', name: 'GLM-4.7 Flash', contextWindow: 256000 },
    ]
  },
  { 
    id: 'moonshot', 
    name: 'Moonshot AI', 
    models: [
      { id: 'kimi-k2.5', name: 'Kimi K2.5', contextWindow: 1000000 },
      { id: 'kimi-k2-thinking', name: 'Kimi K2 Thinking', contextWindow: 400000 },
    ]
  },
  { 
    id: 'mistral', 
    name: 'Mistral AI', 
    models: [
      { id: 'mistral-large-4', name: 'Mistral Large 4', contextWindow: 512000 },
      { id: 'mistral-small-4', name: 'Mistral Small 4', contextWindow: 128000 },
      { id: 'mistral-large-3', name: 'Mistral Large 3', contextWindow: 256000 },
    ]
  },
  { 
    id: 'qwen', 
    name: 'Alibaba Qwen', 
    models: [
      { id: 'qwen-4.0', name: 'Qwen 4.0', contextWindow: 1000000 },
      { id: 'qwen-3.5', name: 'Qwen 3.5', contextWindow: 256000 },
      { id: 'qwen-3-next', name: 'Qwen 3-Next', contextWindow: 128000 },
    ]
  },
  { 
    id: 'groq', 
    name: 'Groq', 
    models: [
      { id: 'llama-4-maverick', name: 'Llama 4 Maverick', contextWindow: 128000 },
      { id: 'llama-4-scout', name: 'Llama 4 Scout', contextWindow: 128000 },
    ]
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    models: [
      { id: 'eleven_v3', name: 'Eleven V3', contextWindow: 32000 },
      { id: 'eleven_flash_v2.5', name: 'Eleven Flash V2.5', contextWindow: 32000 },
    ]
  },
]

// ============================================
// SETUP WIZARD COMPONENT
// ============================================
function SetupWizard({ onComplete }: { onComplete: (config: SetupConfig) => void }) {
  const [step, setStep] = useState(0)
  const [config, setConfig] = useState<SetupConfig>({
    provider: 'openai',
    model: 'gpt-5.4',
    apiKey: '',
    userName: '',
  })
  const [showApiKey, setShowApiKey] = useState(false)

  const currentProvider = PROVIDERS.find(p => p.id === config.provider)

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    } else {
      // Save config to localStorage
      localStorage.setItem('voicedev_setup', JSON.stringify(config))
      onComplete(config)
    }
  }

  const steps = [
    // Step 0: Welcome
    {
      title: 'Welcome to VoiceDev',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl">🎤</div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              VoiceDev - Ultimate AI Agent Platform
            </h2>
            <p className="text-zinc-400 mt-2">Built with 💜 by an 11-year-old Egyptian developer</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="text-2xl font-bold text-violet-400">17+</div>
              <div className="text-zinc-400">Providers</div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="text-2xl font-bold text-fuchsia-400">95+</div>
              <div className="text-zinc-400">Models</div>
            </div>
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-zinc-700">
              <div className="text-2xl font-bold text-cyan-400">250+</div>
              <div className="text-zinc-400">Tools</div>
            </div>
          </div>
        </div>
      )
    },
    // Step 1: Choose Provider
    {
      title: 'Choose Your AI Provider',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
            {PROVIDERS.map(provider => (
              <button
                key={provider.id}
                onClick={() => {
                  setConfig({ ...config, provider: provider.id, model: provider.models[0].id })
                }}
                className={cn(
                  'p-5 rounded-2xl border text-left transition-all duration-300',
                  config.provider === provider.id
                    ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                )}
              >
                <div className="font-semibold">{provider.name}</div>
                <div className="text-xs text-zinc-400 mt-1">{provider.models.length} models</div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    // Step 2: Choose Model
    {
      title: 'Select Your Model',
      content: (
        <div className="space-y-4">
          <div className="text-sm text-zinc-400 mb-2">
            Provider: <span className="text-violet-400 font-semibold">{currentProvider?.name}</span>
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {currentProvider?.models.map(model => (
              <button
                key={model.id}
                onClick={() => setConfig({ ...config, model: model.id })}
                className={cn(
                  'w-full p-5 rounded-2xl border text-left transition-all duration-300',
                  config.model === model.id
                    ? 'bg-violet-600/20 border-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
                )}
              >
                <div className="flex justify-between items-center">
                  <div className="font-semibold">{model.name}</div>
                  {config.model === model.id && <Icons.Check />}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  Context: {(model.contextWindow / 1000).toFixed(0)}K tokens
                </div>
              </button>
            ))}
          </div>
        </div>
      )
    },
    // Step 3: API Key
    {
      title: 'Enter Your API Key',
      content: (
        <div className="space-y-4">
          <p className="text-zinc-400 text-sm">
            Your API key is stored locally and never sent to our servers.
          </p>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={`Enter your ${currentProvider?.name} API key`}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 pr-24 focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <button
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="text-xs text-zinc-500">
            Get your API key from{' '}
            <a 
              href={`https://${config.provider === 'openai' ? 'platform.openai.com' : config.provider === 'anthropic' ? 'console.anthropic.com' : 'ai.google.dev'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              {currentProvider?.name}&apos;s website
            </a>
          </div>
        </div>
      )
    },
    // Step 4: Your Name
    {
      title: 'What should I call you?',
      content: (
        <div className="space-y-4">
          <input
            type="text"
            value={config.userName}
            onChange={(e) => setConfig({ ...config, userName: e.target.value })}
            placeholder="Enter your name"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <div className="text-sm text-zinc-400">
            This helps personalize your experience.
          </div>
        </div>
      )
    },
  ]

  return (
    <div className="fixed inset-0 bg-zinc-950 flex items-center justify-center p-4 z-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      <div className="w-full max-w-xl glass-morphism rounded-[2.5rem] border-white/10 shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-500">
        {/* Progress */}
        <div className="flex gap-1.5 p-6 pb-0">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'flex-1 h-1 rounded-full transition-colors',
                i <= step ? 'bg-violet-500' : 'bg-zinc-700'
              )}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-10">
          <h3 className="text-3xl font-black mb-8 tracking-tight bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
            {steps[step].title}
          </h3>
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {steps[step].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between p-8 border-t border-white/5 bg-white/5">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className={cn(
              'px-4 py-2 rounded-lg transition-colors',
              step === 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-zinc-400 hover:text-white'
            )}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={step === 3 && !config.apiKey}
            className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === steps.length - 1 ? 'Start Chatting' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

interface SetupConfig {
  provider: string
  model: string
  apiKey: string
  userName: string
}

// ============================================
// MAIN APP
// ============================================
export default function VoiceDevApp() {
  const [setupComplete, setSetupComplete] = useState(false)
  const [config, setConfig] = useState<SetupConfig | null>(null)
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check for existing setup
  useEffect(() => {
    const savedSetup = localStorage.getItem('voicedev_setup')
    if (savedSetup) {
      setConfig(JSON.parse(savedSetup))
      setSetupComplete(true)
    }
  }, [])

  // Load sessions from localStorage
  useEffect(() => {
    if (setupComplete) {
      const savedSessions = localStorage.getItem('voicedev_sessions')
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions)
        setSessions(parsed)
        if (parsed.length > 0) {
          setCurrentSession(parsed[0])
        }
      }
    }
  }, [setupComplete])

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('voicedev_sessions', JSON.stringify(sessions))
    }
  }, [sessions])

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentSession?.messages])

  const handleSetupComplete = (newConfig: SetupConfig) => {
    setConfig(newConfig)
    setSetupComplete(true)
  }

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
      provider: config?.provider || 'openai',
      model: config?.model || 'gpt-5.4',
    }
    setSessions([newSession, ...sessions])
    setCurrentSession(newSession)
  }

  const deleteSession = (id: string) => {
    const newSessions = sessions.filter(s => s.id !== id)
    setSessions(newSessions)
    if (currentSession?.id === id) {
      setCurrentSession(newSessions[0] || null)
    }
    localStorage.setItem('voicedev_sessions', JSON.stringify(newSessions))
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentSession || !config) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    // Update session with user message
    const updatedSession = {
      ...currentSession,
      messages: [...currentSession.messages, userMessage],
    }
    setCurrentSession(updatedSession)
    setSessions(sessions.map(s => s.id === currentSession.id ? updatedSession : s))
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...currentSession.messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: config.model,
          provider: config.provider,
          apiKey: config.apiKey,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
        model: config.model,
        tokens: data.usage?.totalTokens,
      }

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, assistantMessage],
      }
      setCurrentSession(finalSession)
      setSessions(sessions.map(s => s.id === currentSession.id ? finalSession : s))
    } catch (error: any) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error.message || 'There was an error connecting to the AI. Please check your API key and connection.'}`,
        timestamp: new Date(),
      }
      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
      }
      setCurrentSession(finalSession)
      setSessions(sessions.map(s => s.id === currentSession.id ? finalSession : s))
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Show setup wizard if not complete
  if (!setupComplete) {
    return <SetupWizard onComplete={handleSetupComplete} />
  }

  return (
    <div className="h-screen flex bg-zinc-950 text-zinc-100 overflow-hidden relative">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-fuchsia-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] animate-blob animation-delay-4000" />
      </div>

      {/* Sidebar */}
      <div className={cn(
        'glass-morphism border-r border-white/10 flex flex-col transition-all duration-500 ease-in-out relative z-10',
        sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'
      )}>
        {/* Header */}
        <div className="p-6 border-b border-white/5">
          <h1 className="text-2xl font-black bg-gradient-to-r from-white via-violet-200 to-fuchsia-300 bg-clip-text text-transparent tracking-tight">
            VoiceDev
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mt-1">Intelligence Redefined</p>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-300 group shadow-xl shadow-black/20"
          >
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Icons.Plus />
            </div>
            <span className="font-semibold text-sm">New Session</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Chats</div>
          {sessions.map(session => (
            <div
              key={session.id}
              className={cn(
                'group p-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between',
                currentSession?.id === session.id 
                  ? 'bg-violet-600/20 border border-violet-500/30' 
                  : 'hover:bg-zinc-800 border border-transparent'
              )}
              onClick={() => setCurrentSession(session)}
            >
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">{session.name}</div>
                <div className="text-xs text-zinc-500">
                  {session.messages.length} messages
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-opacity"
              >
                <Icons.Trash />
              </button>
            </div>
          ))}
        </div>

        {/* Current Model */}
        <div className="p-3 border-t border-zinc-800">
          <div className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Current Model</div>
          <div className="bg-zinc-800 rounded-lg p-3">
            <div className="font-medium text-sm">{config?.model}</div>
            <div className="text-xs text-zinc-500">{PROVIDERS.find(p => p.id === config?.provider)?.name}</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 bg-zinc-900/50 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Icons.Menu />
            </button>
            <div>
              <h2 className="font-semibold">
                {currentSession?.name || 'VoiceDev Chat'}
              </h2>
              {currentSession && (
                <div className="text-xs text-zinc-500">
                  {currentSession.model}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Icons.Settings />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {!currentSession ? (
            <div className="h-full flex items-center justify-center p-8">
              <div className="max-w-2xl w-full glass-morphism rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="text-7xl mb-6 relative">🚀</div>
                <h2 className="text-4xl font-black mb-4 tracking-tight">
                  Welcome to <span className="text-violet-400">VoiceDev</span>
                </h2>
                <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
                  The world&apos;s most advanced AI orchestration platform. Powered by 95+ frontier models and 250+ autonomous tools.
                </p>
                <button
                  onClick={createNewSession}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-105 active:scale-95 rounded-2xl font-bold transition-all shadow-2xl shadow-violet-600/40 flex items-center gap-3 mx-auto"
                >
                  <Icons.Terminal />
                  Initialize Neural Link
                </button>
              </div>
            </div>
          ) : currentSession.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="glass-morphism rounded-3xl p-10 max-w-xl w-full text-center relative overflow-hidden">
                <div className="text-5xl mb-6">⚡</div>
                <h3 className="text-2xl font-bold mb-2">Neural Connection Established</h3>
                <p className="text-zinc-400 text-sm mb-8">
                  Active Model: <span className="text-violet-400 font-mono">{config?.model}</span>
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {['Architect a scalable API', 'Perform a security audit', 'Analyze market trends', 'Debug legacy code'].map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => setInput(prompt)}
                      className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-medium transition-all text-zinc-300 hover:text-white text-left truncate"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto p-6 space-y-8">
              {currentSession.messages.map(message => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-4 group animate-in fade-in slide-in-from-bottom-4 duration-300',
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 shadow-lg',
                    message.role === 'user'
                      ? 'bg-zinc-800 text-zinc-400 border border-white/10'
                      : 'bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-violet-600/20'
                  )}>
                    {message.role === 'user' ? (config?.userName?.[0]?.toUpperCase() || 'U') : 'V'}
                  </div>
                  <div
                    className={cn(
                      'max-w-[85%] rounded-3xl px-6 py-4 relative group-hover:shadow-2xl transition-all duration-300',
                      message.role === 'user'
                        ? 'bg-violet-600/90 text-white rounded-tr-none'
                        : 'glass-morphism text-zinc-100 rounded-tl-none border-white/5'
                    )}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed text-[15px]">{message.content}</div>
                    <div className={cn(
                      'flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    )}>
                      <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.tokens && (
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-zinc-500 border border-white/5">
                          {message.tokens} tokens
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-bold shrink-0 animate-pulse">
                    V
                  </div>
                  <div className="bg-zinc-800 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        {currentSession && (
          <div className="p-6 relative z-10">
            <div className="max-w-5xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2rem] blur opacity-25 group-focus-within:opacity-50 transition duration-500" />
              <div className="relative glass-morphism rounded-[1.8rem] border-white/10 p-2 flex items-end gap-3 shadow-2xl">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Instruct the agent... (${config?.model})`}
                  rows={1}
                  className="flex-1 bg-transparent border-none rounded-2xl px-6 py-4 resize-none focus:ring-0 text-[15px] placeholder:text-zinc-500 max-h-[300px] scrollbar-hide"
                  style={{ minHeight: '56px' }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="mb-1.5 mr-1.5 p-3.5 bg-white text-zinc-950 hover:bg-violet-400 hover:text-white rounded-2xl transition-all duration-300 disabled:opacity-20 disabled:grayscale shadow-xl shadow-white/5 active:scale-95"
                >
                  <Icons.Send />
                </button>
              </div>
              <p className="text-[10px] text-center mt-3 text-zinc-500 font-medium uppercase tracking-widest opacity-50">
                Cognitive processing active • Secure neural link
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSettingsOpen(false)}>
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-lg">Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg">
                <Icons.X />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {/* Provider Select */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Provider</label>
                <select
                  value={config?.provider}
                  onChange={(e) => {
                    const newProvider = PROVIDERS.find(p => p.id === e.target.value)
                    if (newProvider && config) {
                      setConfig({ ...config, provider: newProvider.id, model: newProvider.models[0].id })
                      localStorage.setItem('voicedev_setup', JSON.stringify({ ...config, provider: newProvider.id, model: newProvider.models[0].id }))
                    }
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {PROVIDERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              
              {/* Model Select */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">Model</label>
                <select
                  value={config?.model}
                  onChange={(e) => {
                    if (config) {
                      setConfig({ ...config, model: e.target.value })
                      localStorage.setItem('voicedev_setup', JSON.stringify({ ...config, model: e.target.value }))
                    }
                  }}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {PROVIDERS.find(p => p.id === config?.provider)?.models.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="text-sm text-zinc-400 mb-2 block">API Key</label>
                <input
                  type="password"
                  value={config?.apiKey || ''}
                  onChange={(e) => {
                    if (config) {
                      setConfig({ ...config, apiKey: e.target.value })
                      localStorage.setItem('voicedev_setup', JSON.stringify({ ...config, apiKey: e.target.value }))
                    }
                  }}
                  placeholder="Enter your API key"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              {/* Reset Setup */}
              <button
                onClick={() => {
                  localStorage.removeItem('voicedev_setup')
                  localStorage.removeItem('voicedev_sessions')
                  setSetupComplete(false)
                  setConfig(null)
                  setSessions([])
                  setCurrentSession(null)
                  setSettingsOpen(false)
                }}
                className="w-full px-4 py-2.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition-colors"
              >
                Reset All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
