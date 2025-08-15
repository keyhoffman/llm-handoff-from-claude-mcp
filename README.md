# LLM Handoff MCP Server

MCP server for querying multiple LLMs (ChatGPT, Perplexity, Gemini) from Claude.

## Quick Setup

1. Copy your API keys:
```bash
cp env.example .env
```

2. Edit `.env` with your actual API keys:
```
OPENAI_API_KEY=your_actual_openai_key
PERPLEXITY_API_KEY=your_actual_perplexity_key
GEMINI_API_KEY=your_actual_gemini_key
```

3. Build and run:
```bash
npm run build
npm start
```

## Available Tools

- `ask_chatgpt(prompt)` - Ask ChatGPT
- `ask_perplexity(prompt)` - Ask Perplexity  
- `ask_gemini(prompt)` - Ask Gemini
- `ask_all_llms(prompt)` - Ask all LLMs in parallel

## Claude Integration

Add this to your Claude MCP settings to connect the server.
