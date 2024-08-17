import * as SQLite from "expo-sqlite";
import { intiatelizeDatabase } from "../database";

jest.mock("../database", () => ({
  intiatelizeDatabase: jest.fn(),
}));

test("should call intiatelizeDatabase()", () => {
  intiatelizeDatabase();

  expect(intiatelizeDatabase).toHaveBeenCalled();
});
