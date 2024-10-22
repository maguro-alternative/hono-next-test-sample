// fixtures.ts
import { Bindings, db } from "../db/drizzle";
import { strict as assert } from 'assert';

export interface Todo {
  id: number;
  name: string;
  done: boolean;
}

export interface Assignee {
  todoId: number;
  name: string;
}

export interface Fixture {
  todos : Todo[];
  assignees: Assignee[];

  dbv1: Bindings["DB"];
}

export function newFixture(dbv1: Bindings["DB"]): Fixture {
  return {
    todos: [],
    assignees: [],
    dbv1: dbv1
  };
}

export async function fixtureBuild(fixture:Fixture, ...modelConnectors: ModelConnector[]): Promise<Fixture> {
  for (const modelConnector of modelConnectors) {
    await modelConnector.addToFixtureAndConnect(fixture);
  }

  return fixture;
}

class ModelConnector {
  model: any;
  setter: () => void;
  addToFixture: (fixture: Fixture) => void;
  connect: (connectingModel: any) => any;
  insertTable: (fixture: Fixture) => Promise<void>;
  addedToFixture: boolean = false;
  connectings: ModelConnector[] = [];

  constructor(
    model: any,
    setter: () => void,
    addToFixture: (fixture: Fixture) => void,
    connect: (connectingModel: any) => any,
    insertTable: (fixture: Fixture) => Promise<void>
  ) {
    this.model = model;
    this.setter = setter;
    this.addToFixture = addToFixture;
    this.connect = connect;
    this.insertTable = insertTable;
  }

  connectWith(...connectors: ModelConnector[]): ModelConnector {
    this.connectings.push(...connectors);
    return this; // メソッドチェーンで記述できるようにする
  }

  async addToFixtureAndConnect(fixture: Fixture): Promise<void> {
    if (this.addedToFixture) {
      return ;
    }

    assert(this.addToFixture, `addToFixture field of ${this.model.constructor.name} is not properly initialized`);

    this.setter();
    await this.insertTable(fixture);
    this.addToFixture(fixture);

    for (const modelConnector of this.connectings) {
      assert(this.connect, `${modelConnector.model.constructor.name} cannot be connected to ${this.model.constructor.name}`);
      this.connect(modelConnector.model);
      await modelConnector.addToFixtureAndConnect(fixture);
    }

    this.addedToFixture = true;
  }
}

export { ModelConnector };
