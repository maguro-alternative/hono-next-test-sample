import { integer, serial } from 'drizzle-orm/pg-core';
import {
  timestamp,
  pgTable,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  done: boolean().notNull(),
  created_at: timestamp(),
  updated_at: timestamp(),
});

export const assignees = pgTable('assignees', {
  todoId: integer().primaryKey().references(() => todos.id),
  name: text().notNull(),
  created_at: timestamp(),
  updated_at: timestamp(),
});
