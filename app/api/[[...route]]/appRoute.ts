import { Hono } from "hono";
import { Bindings, db } from "../../../db/drizzle";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

import {
  todosGet
} from "./todo";

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

export default app;
