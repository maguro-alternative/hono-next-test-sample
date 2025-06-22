import { TransactionRollbackError } from 'drizzle-orm';
import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export async function withRollback<TSchema extends Record<string, unknown>>(
  db: PostgresJsDatabase<TSchema>,
  fn: (tx: PgTransaction<any, any, any>) => Promise<void>
) {
  try {
    await db.transaction(async (tx) => {
      try {
        await fn(tx);
      } finally {
        tx.rollback();
      }
    });
  } catch (e) {
    if (!(e instanceof TransactionRollbackError)) {
      console.error(e);
      throw new Error('Unexpected error');
    }
  }
}
