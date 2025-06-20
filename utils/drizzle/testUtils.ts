import { TransactionRollbackError } from 'drizzle-orm';

export async function withRollback(db: any, fn: (tx: any) => Promise<void>) {
  try {
    await db.transaction(async (tx: any) => {
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
