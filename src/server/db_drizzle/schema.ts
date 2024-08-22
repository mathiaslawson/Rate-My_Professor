// schema.ts

import { sql } from "drizzle-orm";
import { index, pgTableCreator, timestamp, varchar } from "drizzle-orm/pg-core";
import { nanoid } from "~/lib/utils";
import { pgTable, text, vector } from "drizzle-orm/pg-core";

// Import the resources table from its file
import { resources } from "./resources";

// Ensure the resources table is exported for external use
export { resources };

export const createTable = pgTableCreator((name) => `mock_${name}`);

export const embeddings = pgTable(
  "embeddings",
  {
    id: varchar("id", { length: 191 })
      .primaryKey()
      .$defaultFn(() => nanoid()),
    resourceId: varchar("resource_id", { length: 191 }).references(
      () => resources.id,
      { onDelete: "cascade" },
    ),
    content: text("content").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }).notNull(),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
