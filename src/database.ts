const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcrypt");

async function getDb() {
  const db = await sqlite.open({
    filename: "./projects.db",
    driver: sqlite3.Database,
  });

  // جدول سفارش‌های مشتری‌ها
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT NOT NULL,
      projectType TEXT NOT NULL,
      locale TEXT NOT NULL,
      timestamp TEXT NOT NULL
    )
  `);

  // جدول کاربران
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // جدول نمونه‌کارهای ادمین
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

  // اضافه کردن نمونه‌کارهای پیش‌فرض (اختیاری)
  const portfolioCount = await db.get("SELECT COUNT(*) as count FROM portfolio");
  if (portfolioCount.count === 0) {
    await db.run(
      "INSERT INTO portfolio (title, description, projectType, timestamp) VALUES (?, ?, ?, ?)",
      ["وبسایت نمونه", "یه وبسایت ساده برای تست", "website", new Date().toISOString()]
    );
    await db.run(
      "INSERT INTO portfolio (title, description, projectType, timestamp) VALUES (?, ?, ?, ?)",
      ["ربات تلگرام", "ربات اتوماسیون تلگرام", "trading-bot", new Date().toISOString()]
    );
    console.log("Added sample portfolio items");
  }

  return db;
}

module.exports = { getDb };