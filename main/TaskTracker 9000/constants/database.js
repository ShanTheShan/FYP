import * as SQLite from "expo-sqlite";

//intiatelize SQLite DB
const db = SQLite.openDatabaseSync("userData");
// DROP TABLE IF EXISTS Projects;
// DROP TABLE IF EXISTS Notes;
// DROP TABLE IF EXISTS ProjectDetails;
// DROP TABLE IF EXISTS Todos;
const intiatelizeDatabase = () => {
  try {
    //database persists across restart
    db.execSync(` 
          CREATE TABLE IF NOT EXISTS Projects (
          id INTEGER PRIMARY KEY, 
          projectName TEXT NOT NULL,
          progress INTEGER NOT NULL
          );

          CREATE TABLE IF NOT EXISTS ProjectDetails (
          id INTEGER PRIMARY KEY,
          projectId INTEGER NOT NULL, 
          tasks TEXT NOT NULL, 
          subtasks TEXT,
          deadline TEXT,
          reminder TEXT, 
          notes TEXT,
          image TEXT,
          completed TEXT NOT NULL, 
          FOREIGN KEY (projectId) REFERENCES Projects (id)
          );

          CREATE TABLE IF NOT EXISTS Notes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          note TEXT NOT NULL,
          image TEXT
          );
          
          CREATE TABLE IF NOT EXISTS Todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          date TEXT NOT NULL,
          todo TEXT NOT NULL,
          done TEXT NOT NULL
          );
          
          `);

    console.log("database.js has ran...");
  } catch (err) {
    console.log(err);
  }
};

intiatelizeDatabase();

export { db };
