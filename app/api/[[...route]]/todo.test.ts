import { TransactionRollbackError } from 'drizzle-orm'
import app from './appRoute'; // テスト対象のファイルをインポート
import { todos } from "../../../db/schema"; // dbオブジェクトをインポートするパスを指定
import { pool } from "../../../db/drizzle"; 

import { fixtureBuild, newFixture } from "../../../fixtures/fixtures";
import newTodo from '../../../fixtures/todo';
import { withRollback } from '../../../utils/drizzle/testUtils';

import { drizzle } from 'drizzle-orm/postgres-js';
const db = drizzle(pool, { schema: { todos } })

describe('GET /', () => {
  it('should return all todos', async () => {
    await withRollback(db, async (tx) => {
      let fixture = newFixture(tx);
      fixture = await fixtureBuild(fixture,
        newTodo(
          (todo) => {
            todo.name = '雪泉';
            todo.done = false;
          }
        )
      );
      const res = await app.request('/api/todos', {}, {
        DB: tx,
      })
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({
        todos: [
          {
            id: fixture.todos[0].id,
            name: '雪泉',
            done: false,
            created_at: fixture.todos[0].createdAt.toJSON(),
            updated_at: fixture.todos[0].updatedAt.toJSON()
          }
        ]
      });
    });
  })
});

describe('POST /', () => {
  it('should create a new todo', async () => {
    try {
      await db.transaction(async (tx) => {
        const res = await app.request('/api/todos', {
          method: 'POST',
          body: JSON.stringify({
            todos: [
              {
                name: '雪泉',
                done: false
              }
            ]
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }, {
          DB: tx,
        })
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
          todos: [
            {
              id: expect.any(Number),
              name: '雪泉',
              done: false,
              created_at: expect.any(String),
              updated_at: expect.any(String)
            }
          ]
        });
        tx.rollback();
      });
    } catch (e) {
      if (!(e instanceof TransactionRollbackError)) {
        console.error(e);
        throw new Error('Unexpected error');
      }
    }
  })
});

afterAll(() => {
  pool.end();
});
