import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
import { ExtractTablesWithRelations } from 'drizzle-orm';
// dbオブジェクトのMock化
export type Bindings = {
  DB: PostgresJsDatabase<Record<string, never>> | PgTransaction<PostgresJsQueryResultHKT, any,  ExtractTablesWithRelations<any>>
}

export const pool = postgres(
  process.env.DATABASE_URL || `postgres://${process.env.DB_HOST}:5432/${process.env.DB_NAME}?user=${process.env.DB_USER}&password=${process.env.DB_PASSWORD}&sslmode=disable`,
);

export const db = drizzle(pool);
