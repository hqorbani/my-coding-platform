import { open } from "sqlite";
import sqlite3 from "sqlite3";

export async function getDb() {
  const db = await open({
    filename: "./projects.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      projectType TEXT NOT NULL,
      locale TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  return db;
}