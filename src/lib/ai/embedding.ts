import natural from "natural";
import { db } from "~/server/db_drizzle";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { embeddings } from "~/server/db_drizzle/schema";

const tfidf = new natural.TfIdf();

const generateChunks = (input: string, maxLength = 1000): string[] => {
  const sentences = input.match(/[^.!?]+[.!?]+/g) ?? [];
  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxLength) {
      chunks.push(currentChunk.trim());
      currentChunk = "";
    }
    currentChunk += sentence + " ";
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};


const createFixedLengthVector = (input: string, length: number): number[] => {
  const words = input.toLowerCase().split(/\W+/);
  const vector = new Array(length).fill(0);

  words.forEach((word, index) => {
    const hash = word
      .split("")
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    vector[hash % length] += 1;
  });

  // Normalize the vector
  const magnitude = Math.sqrt(vector.reduce((sum: number, val: number) => sum + val * val, 0) as number);
  return vector.map((val: number) => val / magnitude);
};


export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  try {
    const chunks = generateChunks(value);

    const embeddings = chunks.map((chunk) => {
      const embedding = createFixedLengthVector(chunk, 1536); // Using 1536 dimensions
      console.log("Embedding dimensions:", embedding.length);
      return { content: chunk, embedding };
    });

    return embeddings;
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw error;
  }
};


export const generateEmbedding = async (value: string): Promise<number[]> => {
  try {
    const input = value.replace(/\s+/g, " ").trim();
    const embedding = createFixedLengthVector(input, 1536); // Using 1536 dimensions
    console.log(
      "Embedding dimensions:",
      embedding.length,
      "embedding is working",
    );
    return embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};


export const findRelevantContent = async (userQuery: string) => {
  try {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
      embeddings.embedding,
      userQueryEmbedded,
    )})`;

  
    const similarGuides = await db
      .select({ name: embeddings.content, similarity })
      .from(embeddings)
      .where(gt(similarity, 0.3))
      .orderBy((t) => desc(t.similarity))
      .limit(4);
    
    console.log("Similar guides:", similarGuides);
    return similarGuides;
  } catch (error) {
    console.error("Error finding relevant content:", error);
    throw error;
  }
};