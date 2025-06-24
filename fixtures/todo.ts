import { Fixture, ModelConnector } from './fixtures';
import { todos } from "../db/schema"
import { InferSelectModel } from "drizzle-orm";

export type Todo = InferSelectModel<typeof todos>;

const newTodo = function(
  setter: ((Todo: Todo) => void)
): ModelConnector {

  const todo = {
    id: 0,
    name: "todo",
    done: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  return new ModelConnector(
    todo,
    // setter
    () => {
      setter(todo);
    },
    // addToFixture
    (fixture: Fixture) => {
      fixture.todos.push(todo);
    },
    // connect
    (connectingModel: any): any => {
      return connectingModel;
    },
    // insertTable
    async (fixture: Fixture) => {
      const t = await fixture.dbv1
        .insert(todos)
        .values(todo)
        .returning();
      todo.id = t[0].id;
    }
  );
}

export default newTodo;