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
  in: any;
	out: {
		json: any;
	};
}>) {
  const data = c.req.valid("json")
  const todo = await c.env.DB
            .insert(todos)
            .values(data.todos)
            .returning();

  return c.json({
    todos: todo
  });
};
