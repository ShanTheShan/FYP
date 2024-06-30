import * as SQLite from "expo-sqlite";

//intiatelize SQLite DB
const db = SQLite.openDatabaseSync("userData");

const intiatelizeDatabase = () => {
  try {
    //database persists across retasrt, delete table to stop duplicates for this dummy data test
    db.execSync(`DROP TABLE IF EXISTS Projects;
          DROP TABLE IF EXISTS ProjectDetails`);
    db.execSync(`
          CREATE TABLE IF NOT EXISTS Projects (
          id INTEGER PRIMARY KEY NOT NULL, 
          projectName TEXT NOT NULL);

          CREATE TABLE IF NOT EXISTS ProjectDetails (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          projectId INTEGER NOT NULL, 
          tasks TEXT NOT NULL, 
          subtasks TEXT, 
          notes TEXT, 
          FOREIGN KEY (projectId) REFERENCES Projects (id));

          INSERT INTO Projects (projectName) VALUES ('Project 1');
          INSERT INTO Projects (projectName) VALUES ('Project 2');


          INSERT INTO ProjectDetails (projectId, tasks) 
          VALUES (1,'Dummy Task 1 Project 1');

          `);
    console.log("database.js has ran...");
  } catch (err) {
    console.log(err);
  }
};

intiatelizeDatabase();

export { db };
