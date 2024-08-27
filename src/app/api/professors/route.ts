import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";
import { findRelevantContent } from "~/lib/ai/embedding"; // Adjust the import path as needed
import { desc } from "drizzle-orm";

type CoreMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request, res: NextApiResponse) {
  const { userId } = auth();
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { messages }: { messages: CoreMessage[] } = await req.json() as { messages: CoreMessage[] };

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const content = ''

  const userPrompt = messages[messages.length - 1]?.content ?? "all professors";
  const relevantContent = await findRelevantContent(userPrompt).then(r => r);

  // console.log(JSON.stringify(relevantContent.map(c => c.name)))

  const result = await generateObject({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful assistant that  finds the rating of professors out of 10 from the following info, ${JSON.stringify(relevantContent.map(c => c.name))}.  if no relevant information is found in the tool calls, respond, "Sorry, I don't know.`,
    messages: [{
      role: "user",
      content: JSON.stringify(relevantContent),
    }],
    schema: z.object({
      professors: z.array(
        z.object({
          name: z.string().describe("The name of the professor."),
          course: z.string().optional().describe("The course taught by the professor, if known."),
          school: z.string().optional().describe("The school of the professor, if known."),
          description: z.string().optional().describe("The description of the professor, if known."),
          // similarities: z.number().optional().describe("The simimarities of the professor to the provided content"),
          rating: z.number().optional().describe("The rating of the professor out of 10, based on how they are talked about on thier course"),
        })
      ),
    }),
  });

  console.log(result.object.professors);

  
  return Response.json(result.object.professors)
}