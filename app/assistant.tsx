"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ThreadListSidebar } from "@/components/assistant-ui/threadlist-sidebar";
import { Separator } from "@/components/ui/separator";

import { useState } from "react";

export const Assistant = () => {
  const [model, setModel] = useState("live-search");

  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/chat",
      body: { model },
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <div className="flex h-dvh w-full pr-0.5">
          {/* ✅ Left sidebar now titled Project ChatBot */}
          <ThreadListSidebar title="Project ChatBot" />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* ✅ Header title changed to Ask me anything */}
                <h2 className="text-lg font-semibold text-gray-800">
                  Ask me anything
                </h2>
              </div>

              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-white border text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="gemini">Google Gemini 2.0</option>
                <option value="live-search">🌐 Live Search (Perplexity-Style)</option>
                <option value="deepseek">🧠 DeepSeek R1 (Reasoning)</option>
                <option value="qwen">💻 Qwen 2.5 (Coding)</option>
                <option disabled>--- Groq Models ---</option>
                <option value="llama3">Llama 3.1 8B (Fast)</option>
                <option value="llama3-70b">Llama 3.3 70B (Smart)</option>
                <option value="mixtral">Mixtral 8x7B</option>
                <option value="gemma2">Gemma 2 9B (Google)</option>
                <option disabled>--- OpenRouter ---</option>
                <option value="openrouter-mistral">Mistral 7B (Free)</option>
                <option value="openrouter-claude-3-5-sonnet">Claude 3.5 Sonnet (Paid)</option>
                <option value="openrouter-gpt-4o">GPT-4o (Paid)</option>
              </select>
            </header>
            <div className="flex-1 overflow-hidden">
              <Thread />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
