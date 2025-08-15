#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import dotenv from 'dotenv'
import { ChatGPTProvider, PerplexityProvider, GeminiProvider, LLMProvider } from './llm-providers.js'

dotenv.config()

// Initialize providers
const providers: LLMProvider[] = []

if (process.env.OPENAI_API_KEY) {
  providers.push(new ChatGPTProvider(process.env.OPENAI_API_KEY))
}

if (process.env.PERPLEXITY_API_KEY) {
  providers.push(new PerplexityProvider(process.env.PERPLEXITY_API_KEY))
}

if (process.env.GEMINI_API_KEY) {
  providers.push(new GeminiProvider(process.env.GEMINI_API_KEY))
}

const server = new Server(
  {
    name: 'llm-handoff',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = []
  
  // Individual provider tools
  for (const provider of providers) {
    tools.push({
      name: `ask_${provider.name.toLowerCase()}`,
      description: `Ask ${provider.name} a question`,
      inputSchema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'The prompt to send to the LLM'
          }
        },
        required: ['prompt']
      }
    })
  }
  
  // Ask all tool
  if (providers.length > 0) {
    tools.push({
      name: 'ask_all_llms',
      description: 'Ask all available LLMs the same question and get their responses',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'The prompt to send to all LLMs'
          }
        },
        required: ['prompt']
      }
    })
  }
  
  return { tools }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params
  
  if (!args || typeof args !== 'object' || !('prompt' in args)) {
    throw new Error('Invalid arguments')
  }
  
  const prompt = args.prompt as string
  
  // Handle individual provider calls
  for (const provider of providers) {
    if (name === `ask_${provider.name.toLowerCase()}`) {
      try {
        const response = await provider.ask(prompt)
        return {
          content: [
            {
              type: 'text',
              text: `**${provider.name} Response:**\n\n${response}`
            }
          ]
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `**${provider.name} Error:**\n\n${error instanceof Error ? error.message : 'Unknown error'}`
            }
          ]
        }
      }
    }
  }
  
  // Handle ask all
  if (name === 'ask_all_llms') {
    const results = await Promise.allSettled(
      providers.map(async (provider) => {
        try {
          const response = await provider.ask(prompt)
          return `**${provider.name}:**\n${response}`
        } catch (error) {
          return `**${provider.name} (Error):**\n${error instanceof Error ? error.message : 'Unknown error'}`
        }
      })
    )
    
    const responses = results.map(result => 
      result.status === 'fulfilled' ? result.value : `Error: ${result.reason}`
    )
    
    return {
      content: [
        {
          type: 'text',
          text: responses.join('\n\n---\n\n')
        }
      ]
    }
  }
  
  throw new Error(`Unknown tool: ${name}`)
})

async function runServer() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('LLM Handoff MCP Server running on stdio')
}

runServer().catch(console.error)
