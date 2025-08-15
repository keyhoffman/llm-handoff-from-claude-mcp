import axios from 'axios'

export interface LLMProvider {
  name: string
  ask: (prompt: string) => Promise<string>
}

export class ChatGPTProvider implements LLMProvider {
  name = 'ChatGPT'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async ask(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data.choices[0].message.content
  }
}

export class PerplexityProvider implements LLMProvider {
  name = 'Perplexity'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async ask(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data.choices[0].message.content
  }
}

export class GeminiProvider implements LLMProvider {
  name = 'Gemini'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async ask(prompt: string): Promise<string> {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    
    return response.data.candidates[0].content.parts[0].text
  }
}
