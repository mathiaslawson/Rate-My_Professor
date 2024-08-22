import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToCoreMessages, streamText, tool } from "ai";
import { z } from "zod";
import { createResource } from "~/lib/actions/resources";
import { generateEmbedding } from "~/lib/ai/embedding";
import { findRelevantContent } from "~/lib/ai/embedding";
import kv from "@vercel/kv";

// Allow streaming responses up to 30 seconds
export const maxDuration = 5;


const cache = new Map<string, string>();

interface MessageType {
  role: "user" | "assistant" | "system";
  content: string;
}


export async function POST(req: Request) {

  const { messages }: { messages: MessageType[] } = await req.json() as { messages: MessageType[] };


  

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const result = await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToCoreMessages(messages),
    tools: {
      addResource: tool({
        description: `Add a resource to your knowledge base.
    If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation.`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
          embedding: z
            .string()
            .optional()
            .describe("the embedding of the content"),
        }),
        execute: async ({ content, embedding }:
          { content: string; embedding?: string }) => {
          
          
          
          const embeddingValue =
            embedding ??
            (await findRelevantContent(content).then((res) => {
              console.log(res, 'from within');
            })) ??
            (await generateEmbedding(content));
                   
          return createResource({ content, embedding: embeddingValue } as { content: string; embedding?: string });
        },
      }),
    },
  });

  console.log("result", result.toDataStreamResponse());

  return result.toDataStreamResponse();
}
