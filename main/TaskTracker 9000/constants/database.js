import * as SQLite from "expo-sqlite";

//intiatelize SQLite DB
const db = SQLite.openDatabaseSync("userData");

const intiatelizeDatabase = () => {
  try {
    //database persists across retasrt
    db.execSync(`
          CREATE TABLE IF NOT EXISTS Projects (
          id INTEGER PRIMARY KEY, 
          projectName TEXT NOT NULL);

          CREATE TABLE IF NOT EXISTS ProjectDetails (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          projectId INTEGER NOT NULL, 
          progress INTEGER NOT NULL,
          tasks TEXT NOT NULL, 
          subtasks TEXT, 
          notes TEXT,
          image TEXT, 
          FOREIGN KEY (projectId) REFERENCES Projects (id));
          `);
    console.log("database.js has ran...");
  } catch (err) {
    console.log(err);
  }
};

intiatelizeDatabase();

export { db };
