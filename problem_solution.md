# MCP LLM Tools - Technical Specification

## Problem

Need to eliminate copy/paste between Claude, ChatGPT, Perplexity, and Gemini while using Claude as central management system.

## Solution

MCP server with individual and broadcast tools for LLM interactions.


### Tool Architecture
#### Individual Tools

1. ask_chatgpt(prompt, context)
2. ask_perplexity(query, context)
3. ask_gemini(prompt, context)

#### Broadcast Tool

1. ask_all_llms(prompt, context) - fires all three in parallel, returns structured results

### Workflow Example

"Ask all LLMs to research X" → gets three responses
Claude synthesizes results automatically