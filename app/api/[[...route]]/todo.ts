import { todos } from "../../../db/schema";
import { Bindings } from "../../../db/drizzle";
import { sql, eq } from "drizzle-orm";
import { Context } from "hono";
import { BlankInput } from "hono/types";

export async function todosGet(c:Context<{
	Bindings: Bindings;
}, "/api/todos", BlankInput>) {
	// クエリパラメータの取得
	// const { q, limit, offset } = c.req.query()
	const todoAll = await c.env.DB.select().from(todos)

	return c.json({
		todos:todoAll
	});
};

export async function todoPost(c:Context<{
  Bindings: Bindings;
}, "/api/todos", {
  in: {
    json: {
      todos: {
        name: string;
        done: boolean;
      }[];
    }
  };
	out: {
		json: {
      todos: {
        id: number;
        name: string;
        done: boolean;
        created_at: string;
        updated_at: string;
      }[];
    }
	};
}>) {
  const data = c.req.valid("json")
  const results = await c.env.DB
            .insert(todos)
            .values(data.todos.map((todo: any) => ({
              ...todo,
              createdAt: new Date(),
              updatedAt: new Date(),
            })))
            .returning();

  const todo = results.map(t => ({
    id: t.id,
    name: t.name,
    done: t.done,
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }));

  return c.json({
    todos: todo
  });
};
