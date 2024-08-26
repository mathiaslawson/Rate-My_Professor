import { generateObject } from "ai";
import { z } from "zod";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NextApiResponse } from "next";
import { auth } from "@clerk/nextjs/server";
import { findRelevantContent } from "~/lib/ai/embedding"; // Adjust the import path as needed

type CoreMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export async function POST(req: Request, res: NextApiResponse) {
  const { userId } = auth();
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { messages }: { messages: CoreMessage[] } = await req.json();

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const userPrompt = messages[messages.length - 1]?.content ?? "all professors";
  const relevantContent = await findRelevantContent(userPrompt).then(r => r.map(c => console.log(c.name)));

  // console.log(JSON.stringify(relevantContent.map(c => c.name)))

  // const result = await generateObject({
  //   model: google("models/gemini-1.5-flash-latest"),
  //   system: `You are a helpful assistant that provides information about professors based on the user's input. Use the following relevant content to answer what the user is prompting: ${JSON.stringify(relevantContent.map(c => c.name))}.  if no relevant information is found in the tool calls, respond, "Sorry, I don't know.`,
  //   messages,
  //   schema: z.object({
  //     professors: z.array(
  //       z.object({
  //         name: z.string().describe("The name of the professor."),
  //         course: z.string().optional().describe("The course taught by the professor, if known."),
  //           school: z.string().optional().describe("The school of the professor, if known."),
  //         rating: z.number().optional().describe("The rating of the professor out of 5, if available."),
  //       })
  //     ),
  //   }),
  // });

  // console.log(result.object.professors);
  return Response.json(relevantContent);
}