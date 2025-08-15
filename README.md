# LLM Handoff MCP Server

An MCP (Model Context Protocol) server that allows Claude to query other LLMs (ChatGPT, Perplexity, Gemini) for verification and comparison without manual copy-pasting.

## The Problem

When working on complex technical problems with Claude, you often want to verify Claude's responses or get alternative perspectives from other LLMs. The typical workflow involves:

1. Having a detailed conversation with Claude about a problem
2. Manually copying the context and question
3. Opening ChatGPT, Perplexity, or Gemini in separate tabs
4. Pasting the context and question into each
5. Waiting for responses
6. Manually comparing the different answers

This is tedious, time-consuming, and breaks your flow when you're deep in a technical discussion.

## The Solution

This MCP server eliminates the copy-paste workflow by allowing Claude to directly query other LLMs on your behalf. When you want verification or alternative perspectives, you simply tell Claude "ask the other LLMs what they think about this" and it automatically:

- Takes the current conversation context
- Formulates an appropriate prompt with all the relevant details
- Queries ChatGPT, Perplexity, and/or Gemini in parallel
- Returns all responses formatted for easy comparison
- Lets you continue the conversation with all perspectives in one place

## Available Tools

- `ask_chatgpt(prompt)` - Query ChatGPT directly
- `ask_perplexity(prompt)` - Query Perplexity directly  
- `ask_gemini(prompt)` - Query Gemini directly
- `ask_all_llms(prompt)` - Query all available LLMs in parallel (most useful)

The server only creates tools for LLMs you have API keys configured for.

## Setup

### 1. Install Dependencies and Build

```bash
npm install
npm run build
```

### 2. Configure API Keys

Copy the example environment file and add your API keys:

```bash
cp env.example .env
```

Edit `.env` with your actual API keys:
```
OPENAI_API_KEY=sk-your-actual-openai-key
PERPLEXITY_API_KEY=your-actual-perplexity-key
GEMINI_API_KEY=your-actual-gemini-key
```

You don't need all three - the server works with whatever APIs you have configured.

### 3. Add to Claude Desktop

1. Open Claude Desktop
2. Go to **Settings** → **Developer** 
3. Click **Edit Config** next to "Local MCP servers"
4. Add this configuration to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "llm-handoff": {
      "command": "node",
      "args": [
        "/Users/yourusername/path/to/llm-handoff-mcp/dist/server.js"
      ],
      "env": {}
    }
  }
}
```

Replace the path with the actual path to your project directory.

5. Save the config file and restart Claude Desktop

### 4. Usage

Once configured, you can use natural language to invoke the tools:

- "Ask the other LLMs what they think about this"
- "Get ChatGPT and Perplexity's take on this problem"
- "Verify this solution with other models"
- "Cross-check this with all available LLMs"

Claude will automatically include the relevant conversation context when querying the other LLMs.

## Updating

When you make changes to the code:

```bash
npm run build
```

Then restart Claude Desktop to use the updated version.
