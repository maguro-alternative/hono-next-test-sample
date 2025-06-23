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
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const assignees = pgTable('assignees', {
  todoId: integer().primaryKey().references(() => todos.id),
  name: text().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
