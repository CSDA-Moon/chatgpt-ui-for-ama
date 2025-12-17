import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: google("gemini-flash-latest"),
      messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("Chat error:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    if (error.cause) console.error("Cause:", JSON.stringify(error.cause, null, 2));
    return new Response(JSON.stringify({ error: "Chat failed", details: error.message }), { status: 500 });
  }
}