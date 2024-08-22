import { sql } from "drizzle-orm";
import { db } from "~/server/db_drizzle/";
import { embeddings as embeddingsTable } from "~/server/db_drizzle/schema";
import { generateEmbeddings } from "../ai/embedding";
import {
  NewResourceParams,
  insertResourceSchema,
  resources,
} from "~/server/db_drizzle/resources";

export async function createResource(input: NewResourceParams) {
  try {
    const { content } = insertResourceSchema.parse(input);

    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    if (!resource) {
      throw new Error("Failed to create resource");
    }

   const embeddings = await generateEmbeddings(content);
   await db.insert(embeddingsTable).values(
     embeddings.map((embedding) => ({
       resourceId: resource.id,
       ...embedding,
     })),
   );

    return {
      success: true,
      message: "Resource successfully created and embedded.",
    };
  } catch (error) {
    console.error("Error in createResource:", error);
    return {
      success: false,
      message:
        error instanceof Error && error.message.length > 0
          ? error.message
          : "Error, please try again.",
    };
  }
}


