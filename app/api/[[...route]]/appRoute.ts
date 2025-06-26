import { Hono } from "hono";
import { Bindings, db } from "../../../db/drizzle";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import {
  todosGet,
  todoPost
} from "./todo";

const todoSchema = z.object({
  name: z.string(),
  done: z.boolean()
});

const todoSchemas = z.object({
  todos: z.array(todoSchema)
});

// basePath は API ルートのベースパスを指定します
// 以降、新たに生やす API ルートはこのパスを基準に追加されます
const app = new Hono<{ Bindings: Bindings }>().basePath("/api")
app.use((c, next) => {
  if (c.env.DB === undefined) {
    c.env.DB = db;
  }
  return next();
});

app.get("/todos", async (c) => {
  return await todosGet(c);
});
app.post("/todos", zValidator("json", todoSchemas), async (c) => {
  return await todoPost(c);
});

export default app;
