import { Fixture, ModelConnector } from './fixtures';
import { todos } from "../db/schema"

export interface Todo {
  id: number;
  name: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const newTodo = function(
  setter: ((Todo: Todo) => void)
): ModelConnector {

  const todo:Todo = {
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
        .values({
          name: todo.name,
          done: todo.done,
          created_at: todo.createdAt,
          updated_at: todo.updatedAt
        })
        .returning();
      todo.id = t[0].id;
    }
  );
}

export default newTodo;