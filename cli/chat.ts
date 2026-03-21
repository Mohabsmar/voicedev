#!/usr/bin/env node
/**
 * VoiceDev CLI Chat
 * Run: npm run chat
 */

import * as readline from 'readline'
import ZAI from 'z-ai-web-dev-sdk'

// ANSI Colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
}

// Models configuration
const PROVIDERS: Record<string, { name: string; models: string[] }> = {
  openai: {
    name: 'OpenAI',
    models: ['gpt-5.4', 'gpt-5.4-mini', 'gpt-5.3-codex', 'o4', 'o4-mini', 'o3']
  },
  anthropic: {
    name: 'Anthropic',
    models: ['claude-sonnet-4.6', 'claude-opus-4.6', 'claude-opus-4.5', 'claude-4-sonnet']
  },
  google: {
    name: 'Google AI',
    models: ['gemini-3.1-pro', 'gemini-3-deep-think', 'gemini-3-pro', 'gemini-2.5-pro']
  },
  deepseek: {
    name: 'DeepSeek',
    models: ['deepseek-v3.2-exp', 'deepseek-v3.1', 'deepseek-r1-0528']
  },
  xai: {
    name: 'xAI (Grok)',
    models: ['grok-4.20-beta', 'grok-4.1-fast', 'grok-4.1']
  },
  zai: {
    name: 'Z.ai (GLM)',
    models: ['glm-5', 'glm-4.7', 'glm-4.7-flash']
  },
  moonshot: {
    name: 'Moonshot AI',
    models: ['kimi-k2.5', 'kimi-k2-thinking']
  },
  mistral: {
    name: 'Mistral AI',
    models: ['mistral-small-4', 'mistral-large-3']
  },
  qwen: {
    name: 'Alibaba Qwen',
    models: ['qwen-3.5', 'qwen-3-next']
  },
  groq: {
    name: 'Groq',
    models: ['llama-4-maverick', 'llama-4-scout']
  },
}

// Chat history
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const messages: Message[] = []

// Current config
let currentProvider = 'openai'
let currentModel = 'gpt-5.4'
let apiKey = process.env.OPENAI_API_KEY || process.env.ZAI_API_KEY || ''

// Readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function println(text: string = '') {
  console.log(text)
}

function printHeader() {
  println()
  println(`${colors.magenta}${colors.bold}╔═══════════════════════════════════════════════════════════╗${colors.reset}`)
  println(`${colors.magenta}${colors.bold}║                                                           ║${colors.reset}`)
  println(`${colors.magenta}${colors.bold}║     🎤 VoiceDev - Ultimate AI Agent Platform              ║${colors.reset}`)
  println(`${colors.magenta}${colors.bold}║     CLI Chat Interface                                    ║${colors.reset}`)
  println(`${colors.magenta}${colors.bold}║     Built with 💜 by an 11-year-old developer             ║${colors.reset}`)
  println(`${colors.magenta}${colors.bold}║                                                           ║${colors.reset}`)
  println(`${colors.magenta}${colors.bold}╚═══════════════════════════════════════════════════════════╝${colors.reset}`)
  println()
}

function printHelp() {
  println(`${colors.cyan}Commands:${colors.reset}`)
  println(`  ${colors.yellow}/help${colors.reset}      - Show this help`)
  println(`  ${colors.yellow}/model${colors.reset}     - Change model`)
  println(`  ${colors.yellow}/provider${colors.reset}  - Change provider`)
  println(`  ${colors.yellow}/clear${colors.reset}     - Clear chat history`)
  println(`  ${colors.yellow}/history${colors.reset}   - Show chat history`)
  println(`  ${colors.yellow}/key${colors.reset}       - Set API key`)
  println(`  ${colors.yellow}/exit${colors.reset}      - Exit chat`)
  println()
  println(`${colors.cyan}Current Settings:${colors.reset}`)
  println(`  Provider: ${colors.green}${PROVIDERS[currentProvider]?.name || currentProvider}${colors.reset}`)
  println(`  Model:    ${colors.green}${currentModel}${colors.reset}`)
  println(`  API Key:  ${apiKey ? `${colors.green}✓ Set${colors.reset}` : `${colors.red}✗ Not set${colors.reset}`}`)
  println()
}

function printProviders() {
  println()
  println(`${colors.cyan}Available Providers:${colors.reset}`)
  let i = 1
  for (const [id, provider] of Object.entries(PROVIDERS)) {
    const current = id === currentProvider ? ` ${colors.green}(current)${colors.reset}` : ''
    println(`  ${colors.yellow}${i}.${colors.reset} ${provider.name}${current}`)
    i++
  }
  println()
}

function printModels() {
  const provider = PROVIDERS[currentProvider]
  if (!provider) return

  println()
  println(`${colors.cyan}Models for ${provider.name}:${colors.reset}`)
  provider.models.forEach((model, i) => {
    const current = model === currentModel ? ` ${colors.green}(current)${colors.reset}` : ''
    println(`  ${colors.yellow}${i + 1}.${colors.reset} ${model}${current}`)
  })
  println()
}

async function chat(userInput: string) {
  if (!apiKey) {
    println(`${colors.red}Error: API key not set. Use /key to set your API key.${colors.reset}`)
    return
  }

  messages.push({ role: 'user', content: userInput })

  process.stdout.write(`${colors.dim}Thinking...${colors.reset}`)

  try {
    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      model: currentModel,
    })

    // Clear "Thinking..." line
    process.stdout.write('\r\x1b[K')

    const response = completion.choices[0]?.message?.content || 'No response'
    messages.push({ role: 'assistant', content: response })

    // Print response
    println()
    println(`${colors.magenta}╭─ ${colors.bold}${currentModel}${colors.reset}${colors.magenta} ─${colors.reset}`)
    println()

    // Word wrap at 60 chars
    const words = response.split(' ')
    let line = ''
    for (const word of words) {
      if (line.length + word.length + 1 > 60) {
        println(`  ${line}`)
        line = word
      } else {
        line += (line ? ' ' : '') + word
      }
    }
    if (line) println(`  ${line}`)

    println()
    println(`${colors.magenta}╰─${colors.reset}`)
    println()

    // Show token usage
    if (completion.usage) {
      println(`${colors.dim}Tokens: ${completion.usage.prompt_tokens} prompt + ${completion.usage.completion_tokens} completion = ${completion.usage.total_tokens} total${colors.reset}`)
      println()
    }
  } catch (error) {
    process.stdout.write('\r\x1b[K')
    println(`${colors.red}Error: ${error instanceof Error ? error.message : 'Unknown error'}${colors.reset}`)
  }
}

function prompt() {
  process.stdout.write(`${colors.green}You:${colors.reset} `)
}

async function handleCommand(input: string) {
  const cmd = input.toLowerCase().trim()

  if (cmd === '/help') {
    printHelp()
  } else if (cmd === '/provider') {
    printProviders()
    rl.question(`${colors.cyan}Select provider (1-${Object.keys(PROVIDERS).length}): ${colors.reset}`, (answer) => {
      const idx = parseInt(answer) - 1
      const providerIds = Object.keys(PROVIDERS)
      if (idx >= 0 && idx < providerIds.length) {
        currentProvider = providerIds[idx]
        currentModel = PROVIDERS[currentProvider].models[0]
        println(`${colors.green}✓ Switched to ${PROVIDERS[currentProvider].name} with model ${currentModel}${colors.reset}`)
      }
      prompt()
    })
    return
  } else if (cmd === '/model') {
    printModels()
    const provider = PROVIDERS[currentProvider]
    rl.question(`${colors.cyan}Select model (1-${provider.models.length}): ${colors.reset}`, (answer) => {
      const idx = parseInt(answer) - 1
      if (idx >= 0 && idx < provider.models.length) {
        currentModel = provider.models[idx]
        println(`${colors.green}✓ Switched to ${currentModel}${colors.reset}`)
      }
      prompt()
    })
    return
  } else if (cmd === '/clear') {
    messages.length = 0
    println(`${colors.green}✓ Chat history cleared${colors.reset}`)
  } else if (cmd === '/history') {
    if (messages.length === 0) {
      println(`${colors.dim}No messages yet${colors.reset}`)
    } else {
      println()
      for (const msg of messages) {
        const role = msg.role === 'user' ? `${colors.green}You${colors.reset}` : `${colors.magenta}AI${colors.reset}`
        println(`${role}: ${msg.content}`)
      }
      println()
    }
  } else if (cmd === '/key') {
    rl.question(`${colors.cyan}Enter API key: ${colors.reset}`, (key) => {
      apiKey = key.trim()
      println(`${colors.green}✓ API key set${colors.reset}`)
      prompt()
    })
    return
  } else if (cmd === '/exit' || cmd === '/quit') {
    println()
    println(`${colors.cyan}Thanks for using VoiceDev! Goodbye! 👋${colors.reset}`)
    rl.close()
    process.exit(0)
  } else if (input.startsWith('/')) {
    println(`${colors.red}Unknown command. Type /help for available commands.${colors.reset}`)
  } else {
    await chat(input)
  }

  prompt()
}

async function main() {
  printHeader()

  // Check for API key
  if (!apiKey) {
    println(`${colors.yellow}⚠ No API key found in environment.${colors.reset}`)
    println(`${colors.yellow}  Set OPENAI_API_KEY or use /key to enter your API key.${colors.reset}`)
    println()
  }

  printHelp()

  // Main loop
  rl.on('line', async (input) => {
    if (input.trim()) {
      await handleCommand(input)
    } else {
      prompt()
    }
  })

  rl.on('close', () => {
    println()
    println(`${colors.cyan}Goodbye! 👋${colors.reset}`)
    process.exit(0)
  })

  prompt()
}

main().catch(console.error)
