import sqlite from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
async function getDb() {
  const db = await sqlite.open({
    filename: "./projects.db",
    driver: sqlite3.Database,
  });

  // جدول سفارش‌ها با ستون‌های جدید
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      description TEXT,  -- ستون جدید برای توضیحات
      files TEXT,        -- مسیر فایل‌ها به‌صورت JSON string
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

  await db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      projectType TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  const userExists = await db.get("SELECT * FROM users WHERE username = ?", ["admin"]);
  if (!userExists) {
    const hashedPassword = await bcrypt.hash("adminpass123", 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", hashedPassword]);
    console.log("Added default user: admin with hashed password");
  }

  return db;
}

module.exports = { getDb };