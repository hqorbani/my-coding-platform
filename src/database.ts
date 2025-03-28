const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

async function getDb() {
  const db = await sqlite.open({
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  const userExists = await db.get("SELECT * FROM users WHERE username = ?", ["admin"]);
  if (!userExists) {
    const hashedPassword = await bcrypt.hash("adminpass123", 10); // هش کردن رمز
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", hashedPassword]);
    console.log("Added default user: admin with hashed password");
  }

  return db;
}

module.exports = { getDb };