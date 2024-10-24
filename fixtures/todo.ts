import { Fixture, ModelConnector, Todo } from './fixtures';
import { todos } from "../db/schema"

const newTodo = function(
  setter: ((Todo: Todo) => void)
): ModelConnector {

  const todo:Todo = {
    id: 0,
    name: "todo",
    done: false
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
          done: todo.done
        })
        .returning();
      todo.id = t[0].id;
    }
  );
}

export default newTodo;