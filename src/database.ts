import { open, Database } from "sqlite";
import sqlite3 from "sqlite3";
import bcrypt from "bcrypt";

// کش برای اتصال دیتابیس
let cachedDb: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  // اگه اتصال قبلاً برقرار شده، همون رو برگردون
  if (cachedDb) {
    return cachedDb;
  }

  // باز کردن دیتابیس
  const db = await open({
    filename: "./projects.db", // مسیر دیتابیس تو ریشه پروژه
    driver: sqlite3.Database,
  });

  // ساخت جدول پروژه‌ها
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      description TEXT,
      files TEXT,
      projectType TEXT NOT NULL,
      locale TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // ساخت جدول کاربران
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // ساخت جدول پورتفولیو
  await db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      projectType TEXT NOT NULL,
      files TEXT,  -- مسیر فایل‌ها به صورت JSON
      timestamp TEXT NOT NULL
    )
  `);

  // چک کردن و اضافه کردن کاربر پیش‌فرض
  const userExists = await db.get("SELECT * FROM users WHERE username = ?", ["admin"]);
  if (!userExists) {
    const hashedPassword = await bcrypt.hash("adminpass123", 10);
    await db.run("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", hashedPassword]);
    console.log("Added default user: admin with hashed password");
  }

  // کش کردن اتصال
  cachedDb = db;
  return db;
}