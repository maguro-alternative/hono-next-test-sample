import { Fixture, ModelConnector } from './fixtures';
import { assignees } from "../db/schema";
import { InferSelectModel } from "drizzle-orm";

export type Assignee = InferSelectModel<typeof assignees>;

const newAssignee = function(
  setter: ((Assignee: Assignee) => void)
): ModelConnector {

  const assignee:Assignee = {
    todoId: 0,
    name: "todo",
    createdAt: new Date(),
    updatedAt: new Date()
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
        .values(assignee)
        .returning();
      assignee.todoId = t.at(0)!.todoId;
    }
  );
}

export default newAssignee;
