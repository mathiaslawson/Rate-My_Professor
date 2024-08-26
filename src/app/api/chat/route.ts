import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
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

// Function to scrape content from the provided URL
async function scrapeContent(url: string | undefined = ''): Promise<string> {
  let browser;

  console.log(url, 'url')

  try {
    browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    });

    // Extract the article content by targeting the elements containing the text
    const articleContent = await page.evaluate(() => {
      const contentElements = document.querySelectorAll('article p, article h1, article h2, article h3, article h4, article h5, article h6, article code, h1, h2, h3, h4, h5, h6, p');
      return Array.from(contentElements).map(el => el.textContent).join('\n');
    });

    return articleContent;
  } catch (error) {
    console.error('An error occurred while scraping:', error);
    throw new Error('Failed to scrape content');
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// POST Request: Handle messages and use Google Generative AI
export async function POST(req: Request) {
 const { messages } = await req.json() as { messages: MessageType[] };

  let scrapedContent = '';

  function isValidUrl(string: string | undefined) {
    try {
      if (string) {
        new URL(string);
        return true;
      }
      return false;
    } catch (_) {
      return false;  
    }
  }
    
  if (messages[messages.length - 1]?.content && isValidUrl(messages[messages.length - 1]?.content)) {
    try {
      scrapedContent = await scrapeContent(messages[messages.length - 1]?.content);
      
      messages.push({
        role: "user",
        content: scrapedContent
      });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to scrape the provided link' }, { status: 500 });
    }
  } else {
    scrapedContent = messages[messages.length - 1]?.content || '';
  }

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });



  const result = await streamText({
    model: google("models/gemini-1.5-flash-latest"),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages: convertToCoreMessages([{role: "user", content: scrapedContent}]),
    tools: {
      addResource: tool({
        description: `Add a resource to your knowledge base.
    If the user provides a random piece of knowledge unprompted, use this tool without asking for confirmation. After that organize that information into professors, thier ratings, and the schools thee work at`,
        parameters: z.object({
          content: z
            .string()
            .describe("the content or resource to add to the knowledge base"),
          embedding: z
            .string()
            .optional()
            .describe("the embedding of the content"),
        }),
        execute: async ({ content, embedding }: { content: string; embedding?: string }) => {
          const embeddingValue =
            embedding ??
            (await findRelevantContent(content).then((res) => {
              // console.log(res, 'from within');
            })) ??
            (await generateEmbedding(content));
  
          return createResource({ content, embedding: embeddingValue } as { content: string; embedding?: string });
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
