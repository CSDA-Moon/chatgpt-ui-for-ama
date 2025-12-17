import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});


export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json();
    let systemMessage = "You are a helpful AI assistant.";

    // Live Search Logic
    if (model === "live-search") {
      try {
        const lastMessageObj = messages[messages.length - 1];
        let lastMessageContent = "";

        if (typeof lastMessageObj.content === "string") {
          lastMessageContent = lastMessageObj.content;
        } else if (Array.isArray(lastMessageObj.content)) {
          // Handle Vercel AI SDK Core 'content' array
          lastMessageContent = lastMessageObj.content.map((p: any) => p.text).join(" ");
        } else if (Array.isArray(lastMessageObj.parts)) {
          // Handle assistant-ui 'parts' array
          lastMessageContent = lastMessageObj.parts.map((p: any) => p.text).join(" ");
        }

        const apiKey = process.env.TAVILY_API_KEY || "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";

        const response = await fetch("https://api.tavily.com/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: apiKey,
            query: lastMessageContent,
            search_depth: "basic",
            include_answer: true,
            max_results: 5,
          }),
        });

        if (!response.ok) {
          throw new Error(`Tavily API error: ${response.statusText}`);
        }

        const data = await response.json();

        let context = "";

        // Use Tavily's direct answer if available
        if (data.answer) {
          context += `TAVILY ANSWER: ${data.answer}\n\n`;
        }

        // Add valid search results if they exist
        if (Array.isArray(data.results)) {
          context += data.results.map((r: any) =>
            `[${r.title}](${r.url}): ${r.content}`
          ).join("\n\n");
        }

        if (!context) {
          context = "No search results found.";
        }

        systemMessage = `You are a helpful Research Assistant with access to real-time web search.
The user's question has been searched on Google, and the results are provided below.
You MUST answer the question based *only* on these results.
Do not say "I cannot browse the web" or "I cannot verify". You HAVE the verified information right here in the SEARCH RESULTS.

SEARCH RESULTS (Real-Time Data):
${context}

Current Date: ${new Date().toLocaleDateString()}`;

      } catch (searchError: any) {
        console.error("Search failed:", searchError);
        // Fallback to normal chat if search fails
      }
    }

    const selectedModel = (() => {
      switch (model) {
        // Groq Models (Updated Dec 2024)
        case "llama3": return groq("llama-3.1-8b-instant");
        case "live-search": // Live Search uses Llama 3.3 70B for better reasoning
          return groq("llama-3.3-70b-versatile");
        // Gemini
        case "gemini": return google("gemini-1.5-flash");
        case "llama3-70b": return groq("llama-3.3-70b-versatile");
        case "mixtral": return groq("mixtral-8x7b-32768");
        case "gemma2": return groq("gemma2-9b-it");

        // New Groq Additions
        case "deepseek": return groq("deepseek-r1-distill-llama-70b");
        case "qwen": return groq("qwen-2.5-32b");

        // OpenRouter Models
        case "openrouter-mistral": return openrouter("mistralai/mistral-7b-instruct:free");
        case "openrouter-claude-3-5-sonnet": return openrouter("anthropic/claude-3.5-sonnet");
        case "openrouter-gpt-4o": return openrouter("openai/gpt-4o");

        // Default
        default: return groq("llama-3.1-8b-instant");
      }
    })();

    const result = streamText({
      model: selectedModel,
      system: systemMessage,
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat failed", details: error.message }), { status: 500 });
  }
}