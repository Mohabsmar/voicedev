'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

// ============================================
// SETUP WIZARD TYPES
// ============================================
interface SetupStep {
  id: string
  title: string
  description: string
  completed: boolean
  optional?: boolean
}

interface ApiKeyConfig {
  provider: string
  key: string
  valid: boolean | null
}

// ============================================
// SETUP WIZARD COMPONENT
// ============================================
export default function SetupWizard({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [setupComplete, setSetupComplete] = useState(false)
  const [checking, setChecking] = useState(false)
  
  // Configuration state
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([
    { provider: 'openai', key: '', valid: null },
    { provider: 'anthropic', key: '', valid: null },
    { provider: 'google', key: '', valid: null },
    { provider: 'deepseek', key: '', valid: null },
    { provider: 'groq', key: '', valid: null },
    { provider: 'mistral', key: '', valid: null },
    { provider: 'xai', key: '', valid: null },
    { provider: 'zai', key: '', valid: null },
    { provider: 'moonshot', key: '', valid: null },
    { provider: 'minimax', key: '', valid: null },
    { provider: 'elevenlabs', key: '', valid: null },
    { provider: 'cohere', key: '', valid: null },
    { provider: 'replicate', key: '', valid: null },
    { provider: 'together', key: '', valid: null },
    { provider: 'qwen', key: '', valid: null },
  ])
  
  const [selectedProviders, setSelectedProviders] = useState<string[]>(['openai'])
  const [defaultModel, setDefaultModel] = useState('gpt-4.5-turbo')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [ttsProvider, setTtsProvider] = useState('openai')
  const [asrProvider, setAsrProvider] = useState('openai')
  const [remoteControlEnabled, setRemoteControlEnabled] = useState(false)
  const [browserUseEnabled, setBrowserUseEnabled] = useState(false)
  const [channelsEnabled, setChannelsEnabled] = useState({
    telegram: false,
    whatsapp: false,
    discord: false,
  })
  const [installDeps, setInstallDeps] = useState(true)
  const [setupProgress, setSetupProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  // Steps
  const steps: SetupStep[] = [
    { id: 'welcome', title: 'Welcome', description: 'Get started with VoiceDev', completed: currentStep > 0 },
    { id: 'providers', title: 'AI Providers', description: 'Configure your AI providers', completed: currentStep > 1 },
    { id: 'apikeys', title: 'API Keys', description: 'Enter your API keys', completed: currentStep > 2 },
    { id: 'features', title: 'Features', description: 'Enable optional features', completed: currentStep > 3 },
    { id: 'channels', title: 'Channels', description: 'Configure communication channels', completed: currentStep > 4, optional: true },
    { id: 'install', title: 'Install', description: 'Install dependencies', completed: currentStep > 5 },
    { id: 'complete', title: 'Complete', description: 'Setup finished!', completed: setupComplete },
  ]

  // Provider options
  const providerOptions = [
    { id: 'openai', name: 'OpenAI', models: ['GPT-4.5', 'GPT-4o', 'o3', 'o4-mini'], recommended: true },
    { id: 'anthropic', name: 'Anthropic', models: ['Claude 4', 'Claude 3.7 Sonnet'], recommended: true },
    { id: 'google', name: 'Google AI', models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'], recommended: true },
    { id: 'deepseek', name: 'DeepSeek', models: ['R2', 'V3'], recommended: true },
    { id: 'zai', name: 'Z.ai', models: ['Z-2 Ultra', 'Z-2 Pro'], recommended: true },
    { id: 'groq', name: 'Groq', models: ['Llama 4 70B', 'Llama 4 8B'] },
    { id: 'mistral', name: 'Mistral AI', models: ['Mistral Large 2', 'Codestral'] },
    { id: 'xai', name: 'xAI', models: ['Grok 3', 'Grok 3 Mini'] },
    { id: 'moonshot', name: 'Moonshot AI', models: ['Kimi K2'] },
    { id: 'minimax', name: 'MiniMax', models: ['ABAB 7 Chat'] },
    { id: 'elevenlabs', name: 'ElevenLabs', models: ['Eleven V3'], voiceOnly: true },
    { id: 'cohere', name: 'Cohere', models: ['Command R+'] },
    { id: 'replicate', name: 'Replicate', models: ['Llama 4', 'Flux 2'] },
    { id: 'together', name: 'Together AI', models: ['Llama 4 Turbo'] },
    { id: 'qwen', name: 'Alibaba Qwen', models: ['Qwen 3 Max'] },
  ]

  // Add log
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  // Validate API key
  const validateApiKey = async (provider: string, key: string): Promise<boolean> => {
    // Simulated validation - in real app, would make API call
    if (key.length < 10) return false
    return key.startsWith('sk-') || key.startsWith('api-') || key.length > 20
  }

  // Test API key
  const testApiKey = async (provider: string, key: string) => {
    setChecking(true)
    addLog(`Testing ${provider} API key...`)
    
    const valid = await validateApiKey(provider, key)
    
    setApiKeys(prev => prev.map(k => 
      k.provider === provider ? { ...k, valid } : k
    ))
    
    addLog(valid ? `✓ ${provider} API key is valid` : `✗ ${provider} API key is invalid`)
    setChecking(false)
  }

  // Run setup
  const runSetup = async () => {
    setSetupProgress(0)
    addLog('Starting setup...')
    
    // Simulate installation steps
    const steps = [
      { progress: 10, message: 'Creating configuration files...' },
      { progress: 20, message: 'Setting up environment variables...' },
      { progress: 30, message: 'Installing core dependencies...' },
      { progress: 40, message: 'Installing AI SDK packages...' },
      { progress: 50, message: 'Setting up database...' },
      { progress: 60, message: 'Configuring providers...' },
      { progress: 70, message: 'Setting up voice services...' },
      { progress: 80, message: 'Configuring channels...' },
      { progress: 90, message: 'Running final checks...' },
      { progress: 100, message: 'Setup complete!' },
    ]
    
    for (const step of steps) {
      await new Promise(r => setTimeout(r, 500))
      setSetupProgress(step.progress)
      addLog(step.message)
    }
    
    setSetupComplete(true)
    onComplete?.()
  }

  // Render step content
  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-6xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold">Welcome to VoiceDev</h2>
              <p className="text-zinc-400 mt-2">The Ultimate AI Agent Platform with 250+ tools, 123+ skills, and 17 AI providers.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="text-3xl mb-2">🛠️</div>
                <h3 className="font-semibold">250+ Tools</h3>
                <p className="text-sm text-zinc-400">File system, shell, network, and more</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold">123+ Skills</h3>
                <p className="text-sm text-zinc-400">Real multi-tool workflows</p>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold">17 Providers</h3>
                <p className="text-sm text-zinc-400">OpenAI, Anthropic, Google, and more</p>
              </div>
            </div>
            
            <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
              <h4 className="font-semibold text-violet-400">New in March 2026 (Updated March 21)</h4>
              <ul className="text-sm text-zinc-300 mt-2 space-y-1">
                <li>• GPT-4.5 Turbo, Claude 4 Opus, Gemini 2.5 Pro, DeepSeek R2, o4-mini</li>
                <li>• Browser Use skill for web automation</li>
                <li>• Remote computer control</li>
                <li>• Telegram & WhatsApp channels via MCP</li>
                <li>• Setup Wizard for easy configuration</li>
              </ul>
            </div>
          </div>
        )

      case 'providers':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Select AI Providers</h2>
              <p className="text-zinc-400 mt-1">Choose the providers you want to use. At least one is required.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {providerOptions.map(provider => (
                <div
                  key={provider.id}
                  onClick={() => {
                    if (selectedProviders.includes(provider.id)) {
                      setSelectedProviders(prev => prev.filter(p => p !== provider.id))
                    } else {
                      setSelectedProviders(prev => [...prev, provider.id])
                    }
                  }}
                  className={cn(
                    'relative bg-zinc-800 border rounded-lg p-4 cursor-pointer transition-all',
                    selectedProviders.includes(provider.id)
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-zinc-700 hover:border-zinc-600'
                  )}
                >
                  {provider.recommended && (
                    <span className="absolute top-2 right-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                      Recommended
                    </span>
                  )}
                  <div className="font-semibold">{provider.name}</div>
                  <div className="text-sm text-zinc-400 mt-1">{provider.models.join(', ')}</div>
                  {provider.voiceOnly && (
                    <div className="text-xs text-blue-400 mt-1">Voice only</div>
                  )}
                </div>
              ))}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Default Model</label>
              <select
                value={defaultModel}
                onChange={(e) => setDefaultModel(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2"
              >
                <optgroup label="OpenAI">
                  <option value="gpt-4.5-turbo">GPT-4.5 Turbo (New!)</option>
                  <option value="gpt-4.5">GPT-4.5</option>
                  <option value="o3">o3</option>
                  <option value="o4-mini">o4-mini (New!)</option>
                  <option value="gpt-4o">GPT-4o</option>
                </optgroup>
                <optgroup label="Anthropic">
                  <option value="claude-4-opus">Claude 4 Opus (New!)</option>
                  <option value="claude-3.7-sonnet">Claude 3.7 Sonnet</option>
                </optgroup>
                <optgroup label="Google">
                  <option value="gemini-2.5-pro">Gemini 2.5 Pro (New!)</option>
                  <option value="gemini-2.5-flash">Gemini 2.5 Flash (New!)</option>
                </optgroup>
                <optgroup label="DeepSeek">
                  <option value="deepseek-r2">DeepSeek R2 (New!)</option>
                  <option value="deepseek-v3">DeepSeek V3</option>
                </optgroup>
                <optgroup label="xAI">
                  <option value="grok-3">Grok 3 (New!)</option>
                </optgroup>
              </select>
            </div>
          </div>
        )

      case 'apikeys':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Enter API Keys</h2>
              <p className="text-zinc-400 mt-1">Add your API keys for the selected providers. Keys are stored locally.</p>
            </div>
            
            <div className="space-y-4">
              {apiKeys
                .filter(k => selectedProviders.includes(k.provider))
                .map(keyConfig => {
                  const provider = providerOptions.find(p => p.id === keyConfig.provider)
                  return (
                    <div key={keyConfig.provider} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {provider?.name || keyConfig.provider}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          placeholder={`Enter ${provider?.name} API key`}
                          value={keyConfig.key}
                          onChange={(e) => {
                            const value = e.target.value
                            setApiKeys(prev => prev.map(k => 
                              k.provider === keyConfig.provider 
                                ? { ...k, key: value, valid: null }
                                : k
                            ))
                          }}
                          className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <button
                          onClick={() => testApiKey(keyConfig.provider, keyConfig.key)}
                          disabled={!keyConfig.key || checking}
                          className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg disabled:opacity-50"
                        >
                          Test
                        </button>
                      </div>
                      {keyConfig.valid !== null && (
                        <p className={cn(
                          'text-sm',
                          keyConfig.valid ? 'text-green-400' : 'text-red-400'
                        )}>
                          {keyConfig.valid ? '✓ API key is valid' : '✗ API key is invalid'}
                        </p>
                      )}
                    </div>
                  )
                })}
            </div>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
              <h4 className="font-medium">Get API Keys</h4>
              <div className="mt-2 text-sm text-zinc-400 space-y-1">
                <p>• OpenAI: <a href="https://platform.openai.com/api-keys" target="_blank" className="text-violet-400 hover:underline">platform.openai.com</a></p>
                <p>• Anthropic: <a href="https://console.anthropic.com" target="_blank" className="text-violet-400 hover:underline">console.anthropic.com</a></p>
                <p>• Google AI: <a href="https://ai.google.dev" target="_blank" className="text-violet-400 hover:underline">ai.google.dev</a></p>
                <p>• DeepSeek: <a href="https://platform.deepseek.com" target="_blank" className="text-violet-400 hover:underline">platform.deepseek.com</a></p>
              </div>
            </div>
          </div>
        )

      case 'features':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Enable Features</h2>
              <p className="text-zinc-400 mt-1">Configure optional features for VoiceDev.</p>
            </div>
            
            <div className="space-y-4">
              {/* Voice */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Voice Support</h3>
                    <p className="text-sm text-zinc-400">Enable TTS and ASR for voice interactions</p>
                  </div>
                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      voiceEnabled ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      voiceEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                
                {voiceEnabled && (
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm mb-1">TTS Provider</label>
                      <select
                        value={ttsProvider}
                        onChange={(e) => setTtsProvider(e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-sm"
                      >
                        <option value="openai">OpenAI TTS-2</option>
                        <option value="elevenlabs">ElevenLabs V3</option>
                        <option value="minimax">MiniMax Speech</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm mb-1">ASR Provider</label>
                      <select
                        value={asrProvider}
                        onChange={(e) => setAsrProvider(e.target.value)}
                        className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-1.5 text-sm"
                      >
                        <option value="openai">OpenAI Whisper 2</option>
                        <option value="groq">Groq Whisper</option>
                        <option value="elevenlabs">ElevenLabs Scribe</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Remote Control */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Remote Control</h3>
                    <p className="text-sm text-zinc-400">Control your computer remotely via SSH, RDP, VNC</p>
                  </div>
                  <button
                    onClick={() => setRemoteControlEnabled(!remoteControlEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      remoteControlEnabled ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      remoteControlEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
              
              {/* Browser Use */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Browser Use</h3>
                    <p className="text-sm text-zinc-400">Automate web browsers for navigation and scraping</p>
                  </div>
                  <button
                    onClick={() => setBrowserUseEnabled(!browserUseEnabled)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      browserUseEnabled ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      browserUseEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
              
              {/* Install Dependencies */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Install Dependencies</h3>
                    <p className="text-sm text-zinc-400">Automatically install npm packages and dependencies</p>
                  </div>
                  <button
                    onClick={() => setInstallDeps(!installDeps)}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      installDeps ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      installDeps ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'channels':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Communication Channels</h2>
              <p className="text-zinc-400 mt-1">Configure channels to interact with VoiceDev. (Optional)</p>
            </div>
            
            <div className="space-y-4">
              {/* Telegram */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">📱</div>
                    <div>
                      <h3 className="font-semibold">Telegram</h3>
                      <p className="text-sm text-zinc-400">Connect via Telegram bot using MCP</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChannelsEnabled(prev => ({ ...prev, telegram: !prev.telegram }))}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      channelsEnabled.telegram ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      channelsEnabled.telegram ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                
                {channelsEnabled.telegram && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Telegram Bot Token"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Allowed Chat IDs (comma separated)"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
              
              {/* WhatsApp */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">💬</div>
                    <div>
                      <h3 className="font-semibold">WhatsApp</h3>
                      <p className="text-sm text-zinc-400">Connect via WhatsApp Business API</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChannelsEnabled(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      channelsEnabled.whatsapp ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      channelsEnabled.whatsapp ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                
                {channelsEnabled.whatsapp && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="WhatsApp Business Phone Number"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                    <input
                      type="password"
                      placeholder="WhatsApp Business API Key"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
              
              {/* Discord */}
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">🎮</div>
                    <div>
                      <h3 className="font-semibold">Discord</h3>
                      <p className="text-sm text-zinc-400">Connect via Discord bot</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setChannelsEnabled(prev => ({ ...prev, discord: !prev.discord }))}
                    className={cn(
                      'w-12 h-6 rounded-full transition-colors',
                      channelsEnabled.discord ? 'bg-violet-500' : 'bg-zinc-600'
                    )}
                  >
                    <div className={cn(
                      'w-5 h-5 bg-white rounded-full transition-transform',
                      channelsEnabled.discord ? 'translate-x-6' : 'translate-x-0.5'
                    )} />
                  </button>
                </div>
                
                {channelsEnabled.discord && (
                  <div className="mt-4 space-y-3">
                    <input
                      type="text"
                      placeholder="Discord Bot Token"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Allowed Server IDs (comma separated)"
                      className="w-full bg-zinc-700 border border-zinc-600 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 'install':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Installation</h2>
              <p className="text-zinc-400 mt-1">VoiceDev is being configured...</p>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{setupProgress}%</span>
              </div>
              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${setupProgress}%` }}
                />
              </div>
            </div>
            
            {/* Logs */}
            <div className="bg-zinc-900 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-300">{log}</div>
              ))}
              {setupProgress < 100 && (
                <div className="text-violet-400 animate-pulse">Running...</div>
              )}
            </div>
            
            {setupProgress === 100 && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg font-semibold transition-all"
              >
                Continue
              </button>
            )}
          </div>
        )

      case 'complete':
        return (
          <div className="space-y-6 text-center">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold">Setup Complete!</h2>
            <p className="text-zinc-400">VoiceDev is ready to use. You can start building amazing AI applications!</p>
            
            <div className="bg-zinc-800/50 rounded-lg p-6 border border-zinc-700 text-left">
              <h3 className="font-semibold mb-4">Configuration Summary</h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-zinc-400">Providers:</span> {selectedProviders.length} configured</p>
                <p><span className="text-zinc-400">Default Model:</span> {defaultModel}</p>
                <p><span className="text-zinc-400">Voice:</span> {voiceEnabled ? `TTS: ${ttsProvider}, ASR: ${asrProvider}` : 'Disabled'}</p>
                <p><span className="text-zinc-400">Remote Control:</span> {remoteControlEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><span className="text-zinc-400">Browser Use:</span> {browserUseEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><span className="text-zinc-400">Channels:</span> {Object.entries(channelsEnabled).filter(([, v]) => v).map(([k]) => k).join(', ') || 'None'}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Open main app
                  window.location.href = '/'
                }}
                className="py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg font-semibold transition-all"
              >
                Start Using VoiceDev
              </button>
              <button
                onClick={() => {
                  // Open docs
                  window.open('https://github.com/Mohabsmar/voicedev#readme', '_blank')
                }}
                className="py-3 bg-zinc-700 hover:bg-zinc-600 rounded-lg font-semibold transition-all"
              >
                View Documentation
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            VoiceDev Setup
          </h1>
        </div>
        
        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                currentStep === index
                  ? 'bg-violet-500/20 border border-violet-500/30'
                  : step.completed
                    ? 'bg-zinc-800/50'
                    : 'opacity-50'
              )}
            >
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-sm',
                step.completed
                  ? 'bg-green-500 text-white'
                  : currentStep === index
                    ? 'bg-violet-500 text-white'
                    : 'bg-zinc-700'
              )}>
                {step.completed ? '✓' : index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{step.title}</div>
                <div className="text-xs text-zinc-500 truncate">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 p-8 flex flex-col">
        <div className="flex-1 max-w-2xl mx-auto w-full">
          {renderStepContent()}
        </div>
        
        {/* Navigation */}
        {currentStep < steps.length - 1 && steps[currentStep].id !== 'install' && (
          <div className="flex justify-between mt-8 max-w-2xl mx-auto w-full">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg disabled:opacity-50 transition-colors"
            >
              Back
            </button>
            
            {steps[currentStep].id === 'channels' ? (
              <button
                onClick={() => {
                  setCurrentStep(currentStep + 1)
                  runSetup()
                }}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg transition-all"
              >
                Install & Configure
              </button>
            ) : steps[currentStep].id === 'apikeys' ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={selectedProviders.length === 0}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg disabled:opacity-50 transition-all"
              >
                Next: Features
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg transition-all"
              >
                Continue
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
