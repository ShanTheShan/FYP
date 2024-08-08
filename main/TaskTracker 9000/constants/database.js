import * as SQLite from "expo-sqlite";

//intiatelize SQLite DB
const db = SQLite.openDatabaseSync("userData");
// DROP TABLE IF EXISTS Projects;
// DROP TABLE IF EXISTS ProjectComments;
// DROP TABLE IF EXISTS ProjectDetails;
// DROP TABLE IF EXISTS ProjectSubTasks;
// DROP TABLE IF EXISTS Notes;
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

          CREATE TABLE IF NOT EXISTS ProjectComments(
          id INTEGER PRIMARY KEY,
          project_id INTEGER NOT NULL,
          comment TEXT NOT NULL,
          FOREIGN KEY (project_id) REFERENCES Projects (id)
          );

          CREATE TABLE IF NOT EXISTS ProjectDetails (
          task_id INTEGER PRIMARY KEY,
          project_id INTEGER NOT NULL, 
          task_name TEXT NOT NULL, 
          deadline TEXT,
          reminder TEXT, 
          image TEXT,
          task_completed TEXT NOT NULL, 
          FOREIGN KEY (project_id) REFERENCES Projects (id)
          );
          
          CREATE TABLE IF NOT EXISTS ProjectSubTasks(
          sub_task_id INTEGER PRIMARY KEY,
          parent_task_id INTEGER NOT NULL,
          subs TEXT NOT NULL,
          sub_completed TEXT NOT NULL,
          FOREIGN KEY (parent_task_id) REFERENCES ProjectDetails(task_id)
          );

          CREATE TABLE IF NOT EXISTS Notes (
          id INTEGER PRIMARY KEY,
          note TEXT NOT NULL,
          image TEXT
          );
          
          CREATE TABLE IF NOT EXISTS Todos (
          id INTEGER PRIMARY KEY,
          date TEXT NOT NULL,
          todo TEXT NOT NULL,
          done TEXT NOT NULL,
          reminder TEXT
          );
          
          `);

    console.log("database.js has ran...");
  } catch (err) {
    console.log(err);
  }
};

intiatelizeDatabase();

export { db };
