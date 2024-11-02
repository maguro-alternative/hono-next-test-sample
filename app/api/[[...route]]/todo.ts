import { todos } from "../../../db/schema";
import { Bindings } from "../../../db/drizzle";
import { sql, eq } from "drizzle-orm";
import { Context } from "hono";
import { BlankInput } from "hono/types";

export async function todosGet(c:Context<{
	Bindings: Bindings;
}, "/api/bwhs", BlankInput>) {
	// クエリパラメータの取得
	// const { q, limit, offset } = c.req.query()
	const todoAll = await c.env.DB.select().from(todos)

	return c.json({
		todos:todoAll
	})
}
