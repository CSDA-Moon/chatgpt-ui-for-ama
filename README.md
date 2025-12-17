# AI Research Assistant (Next.js + Vercel)

This is a turbocharged AI Chatbot built on [assistant-ui](https://github.com/Yonom/assistant-ui).

## 🚀 Features

- **🌐 Live Web Search**: "Perplexity-style" real-time answers using **Llama 3.3 70B** + **Tavily Search**.
- **🧠 Reasoning**: DeepSeek R1 Distill for complex logic.
- **💻 Coding**: Qwen 2.5 Coder for programming tasks.
- **✨ Multiple Providers**: 
  - **Google (Gemini 2.0)**
  - **Groq (Llama 3, Mixtral, Gemma)**
  - **OpenRouter (Claude 3.5, GPT-4o)**

## 🛠️ Setup

1. Clone repo
2. Copy `.env.local` keys:
   - `GOOGLE_GENERATIVE_AI_API_KEY`
   - `TAVILY_API_KEY`
   - `GROQ_API_KEY`
   - `OPENROUTER_API_KEY`
3. `npm run dev`

## 📦 Deployment

Automatically deploys to Vercel on push.
Verified production-ready.

