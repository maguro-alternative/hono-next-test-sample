import { Fixture, ModelConnector, Assignee } from './fixtures';
import { assignees } from "../db/schema"

const newAssignee = function(
  setter: ((Assignee: Assignee) => void)
): ModelConnector {

  const assignee:Assignee = {
    todoId: 0,
    name: "todo",
  };

  return new ModelConnector(
    assignee,
    // setter
    () => {
      setter(assignee);
    },
    // addToFixture
    (fixture: Fixture) => {
      fixture.assignees.push(assignee);
    },
    // connect
    (connectingModel: any): any => {
      return connectingModel;
    },
    // insertTable
    async (fixture: Fixture) => {
      const t = await fixture.dbv1
        .insert(assignees)
        .values({
          todoId: assignee.todoId,
          name: assignee.name
        })
        .returning();
      assignee.todoId = t[0].todoId;
    }
  );
}

export default newAssignee;
